/**
 * Paths.jsx
 * Created by Jonathan Hill 04/13/21
 */

import React from 'react';
import PropTypes from 'prop-types';
import Path from './Path';
import AreaPath from './AreaPath';

const propTypes = {
    data: PropTypes.array,
    xDomain: PropTypes.array,
    yDomain: PropTypes.array,
    xScale: PropTypes.func,
    xScaleForPath: PropTypes.func,
    yScale: PropTypes.func,
    yScaleForPath: PropTypes.func,
    xProperty: PropTypes.string,
    yProperty: PropTypes.string,
    height: PropTypes.number,
    padding: PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        top: PropTypes.number
    })
};

const Paths = ({
    data = [],
    xDomain = [0, 0],
    yDomain = [0, 0],
    xScale = () => {},
    xScaleForPath = () => {},
    yScale = () => {},
    yScaleForPath = () => {},
    height = 0,
    padding = {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    }
}) => (
    <g className="paths">
        <AreaPath
            data={data}
            xScale={xScale}
            yScale={yScale}
            height={height}
            padding={padding} />
        <Path
            data={data.sort((a, b) => a.endDate - b.endDate)}
            xDomain={xDomain}
            yDomain={yDomain}
            xScale={xScaleForPath}
            yScale={yScaleForPath}
            height={height}
            padding={padding} />
    </g>
);

Paths.propTypes = propTypes;
export default Paths;
