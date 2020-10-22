const _ASSETS = ["tankBase.png", "tankTurret.png", "bullet.png"];
const assets = {}


async function downloadAsset(assetName) {
	const asset = new Image();
		asset.onload = () => {
		console.log(`Downloaded ${assetName}`);
	};
	asset.src = `./${assetName}`;
	return asset
}

async function downloadAllAssets(){
	for (let asset of _ASSETS){
		assets[asset] = await downloadAsset(asset);
	}
}

function getAsset(asset){
	return assets[asset];
}

export {downloadAllAssets, getAsset}
