const _ASSETS = ["boom.svg", "bullet.png", "kugla.svg", "M1A.svg", "M1A_top.svg", "matilda.svg", "matilda_top.svg", "pl-01.svg", "pl-01_top.svg", "sherman.svg", "sherman_top.svg", "t-34.svg", "t34_top.svg", "tankBase.png", "tankTurret.png", "tiger_131.svg", "tiger_131_top.svg", "pinkTile.png", "blackTile.png"];
const assets = {}


function downloadAsset(assetName) {
	const asset = new Image();
		asset.onload = () => {
		console.log(`Downloaded ${assetName}`);
	};
	asset.src = `./assets/svgfiles/${assetName}`;
	return asset
}

function downloadAllAssets(){
	for (let asset of _ASSETS){
		assets[asset] = downloadAsset(asset);
	}
}

function getAsset(asset){
	return assets[asset];
}

export {downloadAllAssets, getAsset}
