/**
 * ObligationsByAwardTypeContainer.jsx
 * Created by Brett Varney 4/30/21
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { isCancel } from 'axios';

import ObligationsByAwardType from 'components/agencyV2/visualizations/ObligationsByAwardType';
import { LoadingMessage, ErrorMessage, NoResultsMessage } from 'data-transparency-ui';
import { fetchObligationsByAwardType } from 'apis/agencyV2';
import { setAwardObligations, resetAwardObligations } from 'redux/actions/agencyV2/agencyV2Actions';
import { calculatePercentage } from 'helpers/moneyFormatter';

const propTypes = {
    fiscalYear: PropTypes.number.isRequired,
    windowWidth: PropTypes.number.isRequired,
    isMobile: PropTypes.bool
};

export default function ObligationsByAwardTypeContainer({ fiscalYear, windowWidth, isMobile }) {
    const [categoriesForGraph, setCategoriesForGraph] = React.useState([]);
    const [detailsForGraph, setDetailsForGraph] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [noData, setNoData] = React.useState(false);
    const obligationsByAwardTypeRequest = React.useRef(null);
    const { toptierCode } = useSelector((state) => state.agencyV2.overview);
    const dispatch = useDispatch();

    useEffect(() => () => {
        if (obligationsByAwardTypeRequest.current) {
            obligationsByAwardTypeRequest.current.cancel();
        }
        dispatch(resetAwardObligations());
    }, []);

    const getObligationsByAwardType = () => {
        if (obligationsByAwardTypeRequest.current) {
            obligationsByAwardTypeRequest.current.cancel();
        }
        if (error) {
            setError(false);
        }
        if (noData) {
            setNoData(false);
        }
        if (!loading) {
            setLoading(true);
        }
        obligationsByAwardTypeRequest.current = fetchObligationsByAwardType(toptierCode, fiscalYear);
        obligationsByAwardTypeRequest.current.promise.then((res) => {
            if (Object.keys(res.data).length === 0) {
                setNoData(true);
                setLoading(false);
                obligationsByAwardTypeRequest.current = null;
            }
            else {
                dispatch(setAwardObligations(res.data.total_aggregated_amount));
                const categories = [
                    {
                        label: ['All Financial', 'Assistance'], // line break between words
                        value: 0,
                        color: 'rgb(192, 86, 0)',
                        fadedColor: 'rgb(192, 86, 0, 25%)'
                    },
                    {
                        label: ['All Contracts', ''], // so each cat label array is same length
                        value: 0,
                        color: 'rgb(84, 91, 163)',
                        fadedColor: 'rgb(84, 91, 163, 25%)'
                    }
                ];
                const details = [
                    {
                        label: 'Grants',
                        color: 'rgb(230, 111, 14)',
                        fadedColor: 'rgb(230, 111, 14, 25%)'
                    },
                    {
                        label: 'Loans',
                        color: 'rgb(255, 188, 120)',
                        fadedColor: 'rgb(255, 188, 120, 25%)'
                    },
                    {
                        label: 'Direct Payments',
                        color: 'rgb(250, 148, 65)',
                        fadedColor: 'rgb(250, 148, 65, 25%)'
                    },
                    {
                        label: 'Other Financial Assistance',
                        color: 'rgb(252, 226, 197)',
                        fadedColor: 'rgb(252, 226, 197, 25%)'
                    },
                    {
                        label: 'Contracts',
                        color: 'rgb(127, 132, 186)',
                        fadedColor: 'rgb(127, 132, 186, 25%)'
                    },
                    {
                        label: 'IDVs',
                        color: 'rgb(169, 173, 209)',
                        fadedColor: 'rgb(169, 173, 209, 25%)'
                    }
                ];
                res.data.results.forEach((d) => {
                    switch (d.category) {
                        case 'grants':
                            categories[0].value += d.aggregated_amount;
                            details[0].value = d.aggregated_amount;
                            break;
                        case 'loans':
                            categories[0].value += d.aggregated_amount;
                            details[1].value = d.aggregated_amount;
                            break;
                        case 'direct_payments':
                            categories[0].value += d.aggregated_amount;
                            details[2].value = d.aggregated_amount;
                            break;
                        case 'other':
                            categories[0].value += d.aggregated_amount;
                            details[3].value = d.aggregated_amount;
                            break;
                        case 'contracts':
                            categories[1].value += d.aggregated_amount;
                            details[4].value = d.aggregated_amount;
                            break;
                        case 'idvs':
                            categories[1].value += d.aggregated_amount;
                            details[5].value = d.aggregated_amount;
                            break;
                        default:
                            console.error(`Category name from API not recognized: ${d.category}`);
                            setError(true);
                    }
                });

                // add % of total to category labels
                categories[0].label[2] = ` ${calculatePercentage(categories[0].value, categories[0].value + categories[1].value)}`;
                categories[1].label[1] = ` ${calculatePercentage(categories[1].value, categories[0].value + categories[1].value)}`;

                setCategoriesForGraph(categories);
                setDetailsForGraph(details);
                setLoading(false);
                obligationsByAwardTypeRequest.current = null;
            }
        }).catch((e) => {
            if (!isCancel(e)) {
                console.error(e);
                setError(true);
                setLoading(false);
                obligationsByAwardTypeRequest.current = null;
            }
        });
    };

    useEffect(() => {
        dispatch(resetAwardObligations());
        if (toptierCode) {
            getObligationsByAwardType();
        }
    }, [fiscalYear, toptierCode]);


    return (<>
        {loading && <LoadingMessage />}
        {error && <ErrorMessage />}
        {noData && <NoResultsMessage />}
        {!loading && !error && !noData &&
            <ObligationsByAwardType
                outer={categoriesForGraph}
                inner={detailsForGraph}
                windowWidth={windowWidth}
                fiscalYear={fiscalYear}
                isMobile={isMobile} />
        }
    </>);
}

ObligationsByAwardTypeContainer.propTypes = propTypes;
