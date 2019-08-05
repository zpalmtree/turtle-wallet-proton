// @flow
import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import log from 'electron-log';
import ReactTooltip from 'react-tooltip';
import { session, eventEmitter } from '../index';

type Props = {};

type State = {
  syncStatus: number,
  darkmode: boolean
};

export default class BottomBar extends Component<Props, State> {
  props: Props;

  syncInterval: IntervalID;

  constructor(props?: Props) {
    super(props);
    this.state = {
      syncStatus: session.getSyncStatus(),
      darkmode: session.darkMode
    };
    this.syncInterval = setInterval(() => this.refresh(), 1000);
    this.darkModeOn = this.darkModeOn.bind(this);
    this.darkModeOff = this.darkModeOff.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.syncInterval);
  }

  darkModeOn = () => {
    this.setState({
      darkmode: true
    });
  };

  darkModeOff = () => {
    this.setState({
      darkmode: false
    });
  };

  refresh() {
    this.setState(() => ({
      syncStatus: session.getSyncStatus()
    }));
    ReactTooltip.rebuild();
  }

  render() {
    const {
      darkmode,
      unlockedBalance,
      lockedBalance,
      nodeFee,
      syncStatus
    } = this.state;
    const syncTooltip =
      session.wallet.getSyncStatus()[2] === 0
        ? 'Connecting, please wait...'
        : `${session.wallet.getSyncStatus()[0]}/${
            session.wallet.getSyncStatus()[2]
          }`;

    return (
      <div className="control statusicons">
        <div className="tags has-addons">
          <span className={
            darkmode
              ? 'tag is-dark is-large'
              : 'tag is-white is-large'}>Sync:</span>
          {syncStatus < 100 &&
            session.daemon.networkBlockCount !== 0 && (
              <span
                className="tag is-warning is-large sync-status"
                data-tip={syncTooltip}
              >
                {syncStatus}%
                <ReactLoading
                  type="bubbles"
                  color="#363636"
                  height={30}
                  width={30}
                />
              </span>
            )}
          {syncStatus === 100 &&
            session.daemon.networkBlockCount !== 0 && (
              <span
                className="tag is-success is-large sync-status"
                data-tip={syncTooltip}
              >
                {syncStatus}%
              </span>
            )}
          {session.daemon.networkBlockCount === 0 && (
            <span className="tag is-danger is-large sync-status" data-tip={syncTooltip}>
              <ReactLoading
                type="spinningBubbles"
                color="#F5F5F5"
                height={25}
                width={25}
              />
            </span>
          )}
        </div>
      </div>
    );
  }
}
