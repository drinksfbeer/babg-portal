/* eslint-disable */
const urlParams = () => {
	var search = window.location.search.substring(1);
	return search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
	function(key, value) { return key===""?value:decodeURIComponent(value)  }):{}
}

export default urlParams
