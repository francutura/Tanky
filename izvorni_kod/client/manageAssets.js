const _ASSETS = ["boom.svg", "bullet.png", "kugla.svg", "M1A.svg", "M1A_top.svg", "matilda.svg", "matilda_top.svg", "pl-01.svg", "pl-01_top.svg", "sherman.svg", "sherman_top.svg", "t-34.svg", "t-34_top.svg", "tankBase.png", "tankTurret.png", "tiger_131.svg", "tiger_131_top.svg", "pinkTile.png", "blackTile.png", "livada.svg", "suhozid.svg", "speedBoost.png", "tripleShot.png"];
const assets = {}


async function downloadAsset(assetName) {

   return new Promise((resolve, reject) => {
		const asset = new Image();
		asset.onload = () => resolve(asset)
		asset.onerror = reject
		asset.src = `./assets/svgfiles/${assetName}`;
  	})
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
