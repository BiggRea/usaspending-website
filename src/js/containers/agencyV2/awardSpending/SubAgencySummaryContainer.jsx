import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { isCancel } from 'axios';
import PropTypes from 'prop-types';

import { InformationBoxes } from "data-transparency-ui";
import { awardTypeGroups } from 'dataMapping/search/awardType';
import { fetchSubagencyNewAwardsCount, fetchSubagencySummary } from 'apis/agencyV2';
import BaseAgencySubagencyCount from 'models/v2/agency/BaseAgencySubagencyCount';

const propTypes = {
    fy: PropTypes.string,
    agencyId: PropTypes.string,
    activeTab: PropTypes.string,
    prevTab: PropTypes.string,
    summaryData: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        title: PropTypes.string
    })),
    data: PropTypes.object
};

const SubAgencySummaryContainer = ({
    activeTab,
    fy,
    summaryData,
    data
}) => {
    const numberOfAwardsRequest = useRef(null);
    const summaryRequest = useRef(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const request = React.useRef(null);
    const { toptierCode } = useSelector((state) => state.agencyV2.overview);
    const [numberOfAwards, setNumberOfAwards] = useState(null);
    const [numberOfTransactions, setNumberOfTransactions] = useState(null);
    const [awardObligations, setAwardObligations] = useState(null);

    useEffect(() => {
        if (request.current) {
            request.current.cancel();
        }
        if (numberOfAwardsRequest.current) {
            numberOfAwardsRequest.current.cancel();
        }
        if (summaryRequest.current) {
            summaryRequest.current.cancel();
        }
    }, []);

    const getNewAwardsCount = async () => {
        if (numberOfAwardsRequest.current) {
            numberOfAwardsRequest.current.cancel();
        }
        if (error) {
            setError(false);
        }
        if (!loading) {
            setLoading(true);
        }
        if (activeTab !== 'all') {
            const params = awardTypeGroups[activeTab];
            numberOfAwardsRequest.current = fetchSubagencyNewAwardsCount(toptierCode, fy, params);
        }
        else {
            numberOfAwardsRequest.current = fetchSubagencyNewAwardsCount(toptierCode, fy);
        }
        numberOfAwardsRequest.current.promise
            .then((res) => {
                const newAwards = Object.create(BaseAgencySubagencyCount);
                newAwards.populate(res.data);
                setNumberOfAwards(newAwards.newAwardCount);
                setLoading(false);
                numberOfAwardsRequest.current = null;
            })
            .catch((e) => {
                if (!isCancel(e)) {
                    console.error(e);
                    setError(true);
                    setLoading(false);
                    numberOfAwardsRequest.current = null;
                }
            });
    };

    const getSubagencySummary = async () => {
        if (summaryRequest.current) {
            summaryRequest.current.cancel();
        }
        if (error) {
            setError(false);
        }
        if (!loading) {
            setLoading(true);
        }
        if (activeTab !== 'all') {
            const params = awardTypeGroups[activeTab];
            summaryRequest.current = fetchSubagencySummary(toptierCode, fy, params);
        }
        else {
            summaryRequest.current = fetchSubagencySummary(toptierCode, fy);
        }
        summaryRequest.current.promise
            .then((res) => {
                const subagencySummaryData = Object.create(BaseAgencySubagencyCount);
                subagencySummaryData.populate(res.data);
                setNumberOfTransactions(subagencySummaryData.transactionCount);
                setAwardObligations(subagencySummaryData.obligations);
                setLoading(false);
                summaryRequest.current = null;
            })
            .catch((e) => {
                if (!isCancel(e)) {
                    console.error(e);
                    setError(true);
                    setLoading(false);
                    summaryRequest.current = null;
                }
            });
    };
    useEffect(() => {
        if (toptierCode && data) {
            getNewAwardsCount();
            getSubagencySummary();
        }
    }, [fy, toptierCode, activeTab]);

    const amounts = {
        awardObligations,
        numberOfTransactions,
        numberOfAwards
    };

    return (
        <div className="overview-data-group">
            <InformationBoxes
                boxes={summaryData.map((sdata) => ({
                    ...sdata,
                    amount: amounts[sdata.type],
                    isLoading: loading
                }))} />
        </div>
    );
};

SubAgencySummaryContainer.propTypes = propTypes;
export default SubAgencySummaryContainer;
