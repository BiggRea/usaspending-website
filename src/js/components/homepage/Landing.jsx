/**
 * Landing.jsx
 * Created by Destin Frasier 03/17/2017
 **/

import React from 'react';
import * as Icons from 'components/sharedComponents/icons/Icons';
import NavBar from 'components/sharedComponents/header/NavBar';
import { scrollToY } from 'helpers/scrollToHelper';

export default class Landing extends React.Component {
    constructor(props) {
        super(props);

        this.scrollToBreakdown = this.scrollToBreakdown.bind(this);
    }

    scrollToBreakdown() {
        const sectionDom = document.querySelector('#scroll-to-breakdown');
        if (sectionDom) {
            const sectionTop = sectionDom.offsetTop - 10;
            scrollToY(sectionTop, 700);
        }
    }

    render() {
        return (
            <div className="top-section">
                <div className="site-header">
                    <header>
                        <NavBar homepage />
                    </header>
                </div>
                <div className="landing-parent-wrap" id="main-content">
                    <section
                        className="landing-section-wrap"
                        aria-labelledby="main-focus">
                        <div className="content-wrap">
                            <h1 tabIndex={-1} id="main-focus">
                                In 2016, the U.S. government spent <span className="stronger">$3.85 trillion dollars</span>
                            </h1>
                            <h2>How was that money used? We&apos;ll help you find the answers.</h2>
                            <div className="buttons-wrap">
                                <button
                                    className="getting-started"
                                    title="Get Started"
                                    onClick={this.scrollToBreakdown}>
                                    <div className="getting-started-content">
                                        <div className="label">
                                            Get Started
                                        </div>
                                        <div className="icon">
                                            <Icons.AngleDownCircle
                                                className="usa-da-icon-angle-down-circle"
                                                alt="Get Started" />
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="bottom-gradient" />
            </div>
        );
    }
}
