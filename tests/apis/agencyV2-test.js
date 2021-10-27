/**
 * agencyV2-test.js
 * Created by Brett Varney 10/26/21
 */

//  import * as apis from 'apis/agencyV2';
import { fetchAgencyIds } from 'apis/agencyV2';

import * as apiRequest from '../../src/js/helpers/apiRequest';
import { mockApiCall } from '../testResources/mockApiHelper';

describe('fetchAgencyIds', () => {
    let mockSessionStore = {};

    beforeAll(() => {
        global.Storage.prototype.setItem = jest.fn((key, value) => {
            mockSessionStore[key] = value;
        });
        global.Storage.prototype.getItem = jest.fn((key) => mockSessionStore[key]);
    });

    beforeEach(() => {
        // make sure the mock store starts out empty for each test
        mockSessionStore = {};
    });

    afterAll(() => {
        // remove mock functions from global.Storage
        global.Storage.prototype.setItem.mockReset();
        global.Storage.prototype.getItem.mockReset();
    });


    it('should set the agency ID/slug mapping in session storage', () => {
        const mockResponse = {
            results: [
                { toptier_code: '0', agency_slug: 'zero' },
                { toptier_code: '1', agency_slug: 'one' }
            ]
        };
        mockApiCall(apiRequest, 'apiRequest', mockResponse);
        fetchAgencyIds();

        console.log(sessionStorage.getItem('agencyIds'));
        console.log(JSON.parse(sessionStorage.getItem('agencyIds')));

        expect(window.sessionStorage.getItem('agencyIds')).toEqual('1');
    });
});
