/**
 * SubagencyTableContainer.jsx
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Table, Pagination } from 'data-transparency-ui';
import { subagencyColumns, subagencyFields } from 'dataMapping/agency/tableColumns';
import { awardTypeGroups } from 'dataMapping/search/awardType';
import {
    setSubagencyTotals,
    resetSubagencyTotals
} from 'redux/actions/agencyV2/agencyV2Actions';
import { fetchSubagencySpendingList } from 'apis/agencyV2';
import { parseRows } from 'helpers/agencyV2/AwardSpendingSubagencyHelper';
import { useStateWithPrevious } from 'helpers';

const propTypes = {
    agencyId: PropTypes.string,
    fy: PropTypes.string,
    type: PropTypes.string.isRequired,
    prevType: PropTypes.string,
    subHeading: PropTypes.string
};

const SubagencyTableContainer = ({
    fy,
    agencyId,
    type,
    prevType,
    subHeading
}) => {
    const [prevPage, currentPage, changeCurrentPage] = useStateWithPrevious(1);
    const [prevPageSize, pageSize, changePageSize] = useStateWithPrevious(10);
    const [totalItems, setTotalItems] = useState(0);
    const [prevSort, sort, setSort] = useStateWithPrevious('totalObligations');
    const [prevOrder, order, setOrder] = useStateWithPrevious('desc');
    const updateSort = (field, direction) => {
        setSort(field);
        setOrder(direction);
    };
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const request = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (request.current) {
            request.current.cancel();
        }
        dispatch(resetSubagencyTotals());
    }, []);

    const fetchSpendingBySubagencyCallback = useCallback(() => {
        if (request.current) {
            request.current.cancel();
        }
        setLoading(true);
        setError(false);
        const params = {
            limit: pageSize,
            page: currentPage,
            sort: subagencyFields[sort],
            order
        };
        const typeParam = awardTypeGroups[type];
        request.current = fetchSubagencySpendingList(agencyId, fy, typeParam, params);
        const awardSpendingSubagencyRequest = request.current;
        awardSpendingSubagencyRequest.promise
            .then((res) => {
                const parsedData = parseRows(res.data.results);
                setResults(parsedData);
                dispatch(setSubagencyTotals(parsedData));
                setTotalItems(res.data.page_metadata.total);
                setLoading(false);
            }).catch((err) => {
                setError(true);
                setLoading(false);
                console.error(err);
            });
    });

    useEffect(() => {
        // Reset to the first page
        if (currentPage !== 1) {
            changeCurrentPage(1);
        }
        else if (currentPage === 1) {
            const hasParamChanged = (
                prevSort !== sort ||
                prevOrder !== order ||
                prevPage !== currentPage ||
                prevPageSize !== pageSize ||
                (prevType !== type && prevType)
            );
            if (hasParamChanged) {
                fetchSpendingBySubagencyCallback();
            }
        }
    }, [type, fy, agencyId, pageSize, sort, order]);

    useEffect(() => {
        if (fy) {
            fetchSpendingBySubagencyCallback();
        }
    }, [currentPage, fy]);

    return (
        <div className="table-wrapper">
            <Table
                expandable
                rows={results}
                columns={subagencyColumns}
                currentSort={{ field: sort, direction: order }}
                updateSort={updateSort}
                divider={subHeading}
                loading={loading}
                error={error} />
            <Pagination
                currentPage={currentPage}
                changePage={changeCurrentPage}
                changeLimit={changePageSize}
                limitSelector
                resultsText
                pageSize={pageSize}
                totalItems={totalItems} />
        </div>
    );
};

SubagencyTableContainer.propTypes = propTypes;
export default SubagencyTableContainer;
