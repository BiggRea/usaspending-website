/**
 * AgencyIdHelper.js
 * Created by Brett Varney 10/26/21
 */

/* eslint-disable import/prefer-default-export */
import { fetchAgencyIds } from 'apis/agencyV2';

export function getAgencyId(agency) {
    // ensure ID mapping is in memory
    let agencyMap = window.sessionStorage.getItem('agencyIds');
    if (agencyMap === null) {
        fetchAgencyIds().promise.then((res) => {
            this.agencyMap = res.results.map((a) => ({ [a.agency_slug]: a.toptier_code }));


            console.log(agencyMap);
            console.log(Array.isArray( agencyMap))


            window.sessionStorage.setItem('agencyIds', JSON.stringify(agencyMap));
        });
    }
    else {
        agencyMap = JSON.parse(agencyMap);


        console.log(agencyMap);
        console.log(Array.isArray( agencyMap));


    }

    // eslint-disable-next-line eqeqeq
    if (+agency == agency) {
        if (agencyMap.map((a, i) => a[i]).includes(agency)) {
            return agency;
        }
    }
    else { // if not numeric ID, get database ID for slug


        console.log(agencyMap);
        console.log(Array.isArray( agencyMap));


        const agencyId = agencyMap[agency];
        if (agencyId) {
            return agencyId;
        }
    }

    // if agency not found, 404
}
