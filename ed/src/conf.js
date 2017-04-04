  import {hashHistory} from 'react-router'
  import fi from '@fi/api-client';

/**
 * Array of searchable item types.
 * Every object in this array must have the following attributes:
 *
 * - value: the identifying name that is notably used in url fragments
 * - label: the readable label that is shown to the user in the body of the page
 * - apiName: the name identifying the corresponding API resource
 *
 * @type {[*]}
 */
export const itemTypes = [
  {
    value: 'groupes',
    label: 'groupe d\'appui',
    labelPlural: 'groupes d\'appui',
    apiName: 'allGroups',
    publicApiName: 'groups',
    searchOptions: {}
  },
  {
    value: 'evenements',
    label: 'événement local',
    labelPlural: 'événements locaux',
    apiName: 'allEvents',
    publicApiName: 'events',
    searchOptions: {agenda: 'evenements_locaux'}
  },
  {
    value: 'people',
    label: 'personne',
    labelPlural: 'personnes',
    apiName: 'people',
    searchOptions: {}
  }
];

/**
 * The same information as in ITEM_TYPES above, but organised as a mapping with field value as a key
 * It allows to more easily get all the config information associated with an item type
 *
 * @type {*}
 */
export const itemTypesMap = itemTypes.reduce(function(map, it) {
  map[it.value] = it;
  return map;
}, {});

/**
 * The base location of the API
 * @type {string}
 */
export const API_RO_ENDPOINT = "http://api.redado.dev";
export const API_RW_ENDPOINT = "http://localhost:5001";

export const apiClient = fi.createClient({
  endpoint: API_RW_ENDPOINT,
  auth: 'crossSiteSession'
});

/**
 * The base location of the zipcode API
 */
export const ZIPCODE_ENDPOINT = "https://api-adresse.data.gouv.fr";

/**
 * The specific history handler to use with React Router
 *
 * Right now, we use hashHistory to allow compatibility with github pages.
 * browserHistory would be prettier and more standard, but requires specific
 * configuration of the web server, which cannot be done with gh-pages.
 */
export const HISTORY_HANDLER = hashHistory;

export const NB_ITEMS_PER_PAGE = 5;

export const REQUEST_CACHE_SIZE = 20;
