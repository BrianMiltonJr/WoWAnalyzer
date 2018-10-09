import React from 'react';
import PropTypes from 'prop-types';
import SpellIcon from 'common/SpellIcon';
import { formatNumber, formatPercentage } from 'common/format';
import Toggle from 'react-toggle';
import ReactTooltip from 'react-tooltip';

class HealingEfficiencyBreakdown extends React.Component {
  static propTypes = {
    tracker: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = {
      showHealing: true,
      showDamage: false,
      showPercentages: true,
      detailedView: false,
    };
  }

  Table = (props) => {
    const { tracker } = props;
    const spellDetails = tracker.spellDetails;

    const detailsArray = Object.keys(spellDetails).map(function (key) {
      return spellDetails[key];
    });
    detailsArray.sort((a, b) => {
      if (a.healingDone < b.healingDone) {
        return 1;
      }
      else if (a.healingDone > b.healingDone) {
        return -1;
      }
      else {
        if (a.damageDone < b.damageDone) {
          return 1;
        }
        else if (a.damageDone > b.damageDone) {
          return -1;
        }
      }
      return 0;
    });

    const spellRows = detailsArray.map((value => {
      if (value.casts > 0) {
        return this.SpellRow(value);
      }
      return null;
    }));

    return spellRows;
  };

  SpellRow = (spellDetail) => {
    return (
      <tr key={spellDetail.spell.id}>
        <td>
          <SpellIcon id={spellDetail.spell.id} /> {spellDetail.spell.name}
        </td>
        {this.state.detailedView ? <this.DetailView spellDetail={spellDetail} /> : <this.BarView spellDetail={spellDetail} />}
      </tr>
    );
  };

  BarHeader = (props) => {
    return (
      <>
        {this.state.showHealing &&
        <>
          <th colSpan={2}>
            <dfn data-tip={`Healing per mana spent casting the spell`}>HPM</dfn>
          </th>
          <th colSpan={2}>
            <dfn data-tip={`Healing per second spent casting the spell`}>HPET</dfn>
          </th>
        </>
        }
        {this.state.showDamage &&
        <>
          <th>Damage Done</th>
          <th colSpan={2}>
            <dfn data-tip={`Damage per mana spent casting the spell`}>DPM</dfn>
          </th>
          <th colSpan={2}>
            <dfn data-tip={`Damage per second spent casting the spell`}>DPET</dfn>
          </th>
        </>
        }
      </>
    );
  };

  BarView = (props) => {
    const { spellDetail } = props;
    const hasHealing = spellDetail.healingDone;
    const hasDamage = spellDetail.damageDone > 0;

    return (
      <>
        {this.state.showHealing &&
        <>
          <td>{hasHealing ? formatNumber(spellDetail.hpm) : '-'}</td>
          <td>{hasHealing ? formatNumber(spellDetail.hpm) : '-'}</td>
        </>
        }
        {this.state.showDamage &&
        <>
          <td>{hasDamage ? formatNumber(spellDetail.dpm) : '-'}</td>
          <td>{hasHealing ? formatNumber(spellDetail.hpm) : '-'}</td>
        </>
        }
      </>
    );
  };

  DetailHeader = (props) => {
    return (
      <>
        <th>
          <dfn data-tip={`Total Casts (Number of targets hit)`}>Casts</dfn>
        </th>
        <th>Mana Spent</th>
        {this.state.showHealing &&
        <>
          <th>Healing Done</th>
          <th>Overhealing</th>
          <th>
            <dfn data-tip={`Healing per mana spent casting the spell`}>HPM</dfn>
          </th>
          <th>
            <dfn data-tip={`Healing per second spent casting the spell`}>HPET</dfn>
          </th>
        </>
        }
        {this.state.showDamage &&
        <>
          <th>Damage Done</th>
          <th>
            <dfn data-tip={`Damage per mana spent casting the spell`}>DPM</dfn>
          </th>
          <th>
            <dfn data-tip={`Damage per second spent casting the spell`}>DPET</dfn>
          </th>
        </>
        }
      </>
    );
  };

  DetailView = (props) => {
    const { spellDetail } = props;
    const hasHealing = spellDetail.healingDone;
    const hasOverhealing = spellDetail.healingDone > 0 || spellDetail.overhealingDone > 0;
    const hasDamage = spellDetail.damageDone > 0;

    return (
      <>
        <td>{spellDetail.casts} ({spellDetail.healingHits + spellDetail.damageHits})</td>
        <td>
          {formatNumber(spellDetail.manaSpent)}
          {this.state.showPercentages ? ' (' + formatPercentage(spellDetail.manaPercentSpent) + '%)' : ''}
        </td>
        {this.state.showHealing &&
        <>
          <td>
            {hasHealing ? formatNumber(spellDetail.healingDone) : '-'}
            {hasHealing && this.state.showPercentages ? ' (' + formatPercentage(spellDetail.percentHealingDone) + '%)' : ''}
          </td>
          <td>
            {hasOverhealing ? formatNumber(spellDetail.overhealingDone) : '-'}
            {hasOverhealing && this.state.showPercentages ? ' (' + formatPercentage(spellDetail.percentOverhealingDone) + '%)' : ''}
          </td>
          <td>{hasHealing ? formatNumber(spellDetail.hpm) : '-'}</td>
          <td>{hasHealing ? formatNumber(spellDetail.healingPerTimeSpentCasting * 1000) : '-'}</td>
        </>
        }
        {this.state.showDamage &&
        <>
          <td>
            {hasDamage ? formatNumber(spellDetail.damageDone) : '-'}
            {hasDamage && this.state.showPercentages ? ' (' + formatPercentage(spellDetail.percentDamageDone) + '%)' : ''}
          </td>
          <td>{hasDamage ? formatNumber(spellDetail.dpm) : '-'}</td>
          <td>{hasDamage ? formatNumber(spellDetail.damagePerTimeSpentCasting * 1000) : '-'}</td>
        </>
        }
      </>
    );
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { tracker } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="toggle-control pull-right" style={{ 'marginLeft': '.5em', 'marginRight': '.5em' }}>
              <Toggle
                defaultChecked={false}
                icons={false}
                onChange={event => this.setState({ showDamage: event.target.checked })}
                id="damage-toggle"
              />
              <label htmlFor="damage-toggle" style={{ marginLeft: '0.5em' }}>
                Show Damage
              </label>
            </div>
            <div className="toggle-control pull-right" style={{ 'marginLeft': '.5em', 'marginRight': '.5em' }}>
              <Toggle
                defaultChecked
                icons={false}
                onChange={event => this.setState({ showHealing: event.target.checked })}
                id="healing-toggle"
              />
              <label htmlFor="healing-toggle" style={{ marginLeft: '0.5em' }}>
                Show Healing
              </label>
            </div>
            <div className="toggle-control pull-right" style={{ 'marginLeft': '.5em', 'marginRight': '.5em' }}>
              <Toggle
                defaultChecked
                icons={false}
                onChange={event => this.setState({ showPercentages: event.target.checked })}
                id="percent-toggle"
              />
              <label htmlFor="percent-toggle" style={{ marginLeft: '0.5em' }}>
                Show Percentages
              </label>
            </div>
            <div className="toggle-control pull-right" style={{ 'marginLeft': '.5em', 'marginRight': '.5em' }}>
              <Toggle
                defaultChecked={false}
                icons={false}
                onChange={event => this.setState({ detailedView: event.target.checked })}
                id="detailed-toggle"
              />
              <label htmlFor="detailed-toggle" style={{ marginLeft: '0.5em' }}>
                Detailed View
              </label>
            </div>
          </div>
          <div className="col-md-12">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ability</th>
                  {this.state.detailedView ? <this.DetailHeader /> : <this.BarHeader />}
                </tr>
              </thead>
              <tbody>
                <this.Table tracker={tracker} showHealing={this.state.showHealing} showDamage={this.state.showDamage} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default HealingEfficiencyBreakdown;
