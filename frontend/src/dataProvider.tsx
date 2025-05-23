//Source code generated by AppGPT (www.appgpt.tech)
import { GetListParams } from 'ra-core';
import postgrestRestProvider from '@promitheus/ra-data-postgrest';
import qs from 'qs';

const fieldConfig = {
  Characters: [
    {
      field: 'name',
      datatype: 'String',
    },
    {
      field: 'health',
      datatype: 'Integer',
    },
    {
      field: 'strength',
      datatype: 'Integer',
    },
    {
      field: 'speed',
      datatype: 'Integer',
    },
    {
      field: 'special_move',
      datatype: 'String',
    },
    {
      field: 'image',
      datatype: 'String',
    },
    {
      field: 'youtube_channel',
      datatype: 'String',
    },
    {
      field: 'fame',
      datatype: 'Integer',
    },
    {
      field: 'id',
      datatype: 'Integer',
    },
  ],
  Moves: [
    {
      field: 'name',
      datatype: 'String',
    },
    {
      field: 'damage',
      datatype: 'Integer',
    },
    {
      field: 'type',
      datatype: 'String',
    },
    {
      field: 'animation',
      datatype: 'String',
    },
    {
      field: 'character_id',
      datatype: 'Integer',
    },
    {
      field: 'id',
      datatype: 'Integer',
    },
  ],
  Arenas: [
    {
      field: 'name',
      datatype: 'String',
    },
    {
      field: 'background_image',
      datatype: 'String',
    },
    {
      field: 'weather',
      datatype: 'String',
    },
    {
      field: 'unlock_level',
      datatype: 'Integer',
    },
    {
      field: 'id',
      datatype: 'Integer',
    },
  ],
  Matches: [
    {
      field: 'player1_id',
      datatype: 'Integer',
    },
    {
      field: 'player2_id',
      datatype: 'Integer',
    },
    {
      field: 'arena_id',
      datatype: 'Integer',
    },
    {
      field: 'winner_id',
      datatype: 'Integer',
    },
    {
      field: 'duration',
      datatype: 'Integer',
    },
    {
      field: 'date',
      datatype: 'DateTime',
    },
    {
      field: 'id',
      datatype: 'Integer',
    },
  ],
  Players: [
    {
      field: 'username',
      datatype: 'String',
    },
    {
      field: 'email',
      datatype: 'String',
    },
    {
      field: 'avatar',
      datatype: 'String',
    },
    {
      field: 'level',
      datatype: 'Integer',
    },
    {
      field: 'favorite_character',
      datatype: 'Integer',
    },
    {
      field: 'id',
      datatype: 'Integer',
    },
  ],
};

export const customDataProvider = (apiUrl, options = {}) => {
  const baseDataProvider = postgrestRestProvider(apiUrl);
  return {
    ...baseDataProvider,
    getList: async (resource, params) => {
      if (params.filter && params.filter.q) {
        return await GetListQ(resource, params, apiUrl, baseDataProvider);
      } else {
        return baseDataProvider.getList(resource, params);
      }
    },
  };
};

async function GetListQ(
  resource,
  params: Partial<GetListParams> = {},
  apiUrl,
  baseDataProvider,
) {
  const { page, perPage } = params.pagination;
  const { field, order } = params.sort || {};
  const searchText = params.filter.q.toLowerCase();

  let filter = { or: '(id.eq.-1)' }; //return no data if resource has not been configured
  if (fieldConfig[resource]) {
    let searchConditions = fieldConfig[resource].reduce(
      (conditions, { field, datatype }) =>
        conditions +
        (datatype == 'String'
          ? field + '.ilike.%' + searchText + '%,'
          : //Todo: add support for searching other types
            ''),
      '',
    );
    filter = { or: '(' + searchConditions.slice(0, -1) + ')' };
  }
  let query = {
    offset: String((page - 1) * perPage),
    limit: String(perPage),
    // append filters
    ...filter,
  };

  if (field && order) {
    query.order = field + '.' + order.toLowerCase();
  }

  // add header that Content-Range is in returned header
  const options = {
    headers: new Headers({
      Accept: 'application/json',
      Prefer: 'count=exact',
      ...(params.meta?.headers || {}),
      //...useCustomSchema(config.schema, metaSchema, 'GET'),
    }),
  };

  const url = apiUrl + '/' + resource + '?' + qs.stringify(query);
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = 'An error has occured: ' + response.status;
    throw new Error(message);
  }
  if (!response.headers.has('content-range')) {
    throw new Error(
      `The Content-Range header is missing in the HTTP Response. The postgREST data provider expects 
            responses for lists of resources to contain this header with the total number of results to build 
            the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?`,
    );
  }
  const json = await response.json();
  return {
    data: json,
    total: parseInt(response.headers.get('content-range').split('/').pop(), 10),
  };
}
