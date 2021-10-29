/**
 * agencyV2-test.js
 * Created by Brett Varney 10/26/21
 */

import { getAgencyId } from 'helpers/agencyV2/AgencyIdHelper';

import * as apiRequest from '../../src/js/helpers/apiRequest';
import { mockApiCall } from '../testResources/mockApiHelper';

describe('getAgencyId', () => {

    beforeEach(() => {
        window.sessionStorage.clear();
    });

    it('should find the agency ID for a given slug', () => {
        const mockResponse = {
            results: [
                { toptier_code: '0', agency_slug: 'zero' },
                { toptier_code: '1', agency_slug: 'one' }
            ]
        };
        mockApiCall(apiRequest, 'apiRequest', mockResponse);
        expect(getAgencyId('one')).toEqual('1');
    });
});
