import React from 'react';
import { fetchApi } from '../../../helpers/fetchApi';

function metricHoc(WrappedComponent, fetchUrl) {
	return class extends React.Component {
		state = {
			metrics: [],
			loading: false,
			error: '',
			width: window.innerWidth - 300,
		}
		componentDidMount() {
			// window.addEventListener("resize", this.updateDimensions);
			this.setState({ loading: true });
			this.updateDimensions();
			fetchApi({ url: fetchUrl}, (err, metrics) => {
				this.setState({ metrics, loading: false })
			})
		}
		// componentWillUnmount() {
		// 	window.removeEventListener("resize", this.updateDimensions);
		// }
		updateDimensions = () => {
			const container = document.getElementById('metric-container')
			if (container) {
				const width = container.clientWidth - 50;
				this.setState({ width});
			}
		}
		render() {
			return (
				<WrappedComponent {...this.state} {...this.props} />
			)
		}
	}
}

export default metricHoc;
