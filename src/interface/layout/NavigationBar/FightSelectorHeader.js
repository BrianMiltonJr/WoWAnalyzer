import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';

import getFightName from 'common/getFightName';
import { getFightId, getPlayerId, getPlayerName, getResultTab } from 'interface/selectors/url/report';
import { getReport } from 'interface/selectors/report';
import { getFightById } from 'interface/selectors/fight';
import FightSelectionPanelList from 'interface/report/FightSelectionPanelList';

import SelectorBase from './SelectorBase';

class FightSelectorHeader extends SelectorBase {
  static propTypes = {
    report: PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      fights: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        difficulty: PropTypes.number,
        boss: PropTypes.number.isRequired,
        start_time: PropTypes.number.isRequired,
        end_time: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        kill: PropTypes.bool,
      })),
    }),
    fight: PropTypes.object,
    playerId: PropTypes.number,
    playerName: PropTypes.string,
    resultTab: PropTypes.string,
  };
  state = {
    killsOnly: false,
  };

  render() {
    const { report, fight, playerId, playerName, resultTab, ...others } = this.props;
    delete others.dispatch;
    const { killsOnly, show } = this.state;

    const player = playerId ? report.friendlies.find(friendly => friendly.id === playerId) : report.friendlies.find(friendly => friendly.name === playerName);

    return (
      <div ref={this.ref} {...others}>
        <a onClick={this.handleClick}>{getFightName(report, fight)}</a>
        {show && player && (
          <span className="selectorHeader">
            <div className="panel">
              <div className="panel-heading">
                <div className="flex wrapable">
                  <div className="flex-main" style={{ minWidth: 200 }}>
                    <h2>Select the fight to parse for {player.name}</h2>
                  </div>
                  <div className="flex-sub text-right toggle-control action-buttons">
                    <Toggle
                      checked={killsOnly}
                      icons={false}
                      onChange={event => this.setState({ killsOnly: event.currentTarget.checked })}
                      id="kills-only-toggle"
                    />
                    <label htmlFor="kills-only-toggle">
                      {' '}Kills only
                    </label>
                  </div>
                </div>
              </div>
              <div className="panel-body" style={{ padding: 0 }} onClick={this.handleClick}>
                {player && (
                  <FightSelectionPanelList
                    report={report}
                    fights={
                      player.fights.map(f => report.fights[f.id - 1]) // TODO: We should check if the id's match!
                    }
                    playerId={player.id}
                    resultTab={resultTab}
                    killsOnly={this.state.killsOnly}
                  />
                )}
              </div>
            </div>
          </span>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  report: getReport(state),
  fight: getFightById(state, getFightId(state)),
  playerId: getPlayerId(state),
  playerName: getPlayerName(state),
  resultTab: getResultTab(state),
});

export default connect(mapStateToProps)(FightSelectorHeader);
