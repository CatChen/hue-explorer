import JsonEditor from './json/JsonEditor';
import HueColor from '../api/HueColor';
import React, { Component } from 'react';

class LightsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'graphics',
    }
  }

  onGraphViewClick() {
    this.setState({
      view: 'graphics',
    });
  }

  onJsonViewClick() {
    this.setState({
      view: 'json',
    });
  }

  render() {
    const json = this.props.json;
    let viewContent;
    switch (this.state.view) {
      case 'graphics':
        let rgb = [
          HueColor.RGB_MAX_VALUE,
          HueColor.RGB_MAX_VALUE,
          HueColor.RGB_MAX_VALUE,
        ];
        switch (json.state.colormode) {
          case 'hs':
            // Not yet supported;
            break;
          case 'xy':
            rgb = HueColor.fromXyToRgb(json.state.xy, json.state.bri);
            break;
          case 'ct':
            // Not yet supported;
            break;
          default:
            throw new Error(`Unsupported colormode: ${json.state.colormode}`);
        }
        if (!json.state.on) {
          rgb = [0, 0, 0];
        }
        const hex = HueColor.fromRgbToHex(rgb);
        const grayscale = HueColor.fromColorToGrayscale(rgb);
        const fontColor = grayscale < 128 ? 'white' : 'black';
        const brightness = json.state.bri / HueColor.MAX_BRIGHTNESS;
        viewContent = (
          <React.Fragment>
            <h5 className="card-title">
              {json.name}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {`${json.productname} (${json.manufacturername} ${json.modelid})`}
            </h6>
            <div className="input-group">
              <div className="input-group-prepend">
                <button
                  type="button"
                  className={'input-group-text btn btn-light' + (json.state.on ? ' active' : '')}
                >
                  {json.state.on ? 'On' : 'Off'}
                </button>
              </div>
              <input
                type="text"
                value={hex}
                style={{
                  backgroundColor: hex,
                  backgroundImage: `linear-gradient(90deg, ${hex} 0%, ${hex} ${brightness * 100}%, black ${brightness * 100}%, black 100%)`,
                  color: fontColor,
                }}
                className="form-control"
                placeholder="#ffffff"
                aria-label="Light color"
                aria-describedby="btnGroupAddon"
                readOnly
              />
            </div>
          </React.Fragment>
        );
        break;
      case 'json':
        viewContent = <JsonEditor json={json} />;
        break;
      default:
        throw new Error(`Unknown view: ${this.state.view}`);
    }
    return (
      <div className="card my-3">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a
                className={'nav-link' + (this.state.view === 'graphics' ? ' active' : '')}
                onClick={this.onGraphViewClick.bind(this)}
                href="###"
              >
                Graphics
              </a>
            </li>
            <li className="nav-item">
              <a
                className={'nav-link' + (this.state.view === 'json' ? ' active' : '')}
                onClick={this.onJsonViewClick.bind(this)}
                href="###"
              >
                JSON
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {viewContent}
        </div>
      </div>
    );
  }
}

export default LightsView;
