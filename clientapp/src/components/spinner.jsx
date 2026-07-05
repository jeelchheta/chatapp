import { Component } from "react";
import { Label } from "../constant/constant";

export default class Spinner extends Component {
    render() {
        const { spinnerColor, isActive, text } = this.props;
        return isActive ? <div class={`spinner-border ${spinnerColor ? spinnerColor : "text-light"}`} role="status">
            <span class="visually-hidden"></span>
        </div> : text;
    }
}

export class CardWithSpinner extends Component {
    render() {
        const { spinnerColor, isActive } = this.props;
        return <div class="card text-center">
            <div class="card-body p-0">
                {isActive ? <Spinner spinnerColor={spinnerColor} /> : Label.empty_msg}
            </div>
        </div>;
    }
}

export class DotLoading extends Component {
    render() {
        const { spinnerColor, isActive } = this.props;
        return isActive ? <div class="dot-loader"></div> : null;
    }
}