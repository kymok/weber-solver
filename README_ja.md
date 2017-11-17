# Simple Weber Problem Solver

## Demo

https://kymok.github.io/weber-solver/

## ウェーバー問題

点と重みの組が与えられたとき，それらへの重み付き距離の総和を最小化する点の位置を求めます．ここでは，単純な最急降下法を利用して解いています．

## 使用法

- 地図の上をクリックしてマーカーを置きます．
- 既存のマーカーをドラッグして位置を変更することができます．
- 既存のマーカーをクリックすると，マーカーを消去します．
- 重み関数を選ぶことができます：
  - なし：距離の総和を最小化します．
  - 距離：2乗距離の総和を最小化します．


## 例

- ｛東京，ロンドン，ニューヨーク｝のウェーバー点は，アイスランド付近です．（正距方位図法の地図作成には[どこでも方位図法](http://maps.ontarget.cc/azmap/)を使用しました）

  <img src="https://raw.githubusercontent.com/kymok/weber-solver/master/docs/images/tokyo-ny-london.png" width="50%" height="50%">

  <img src="https://raw.githubusercontent.com/kymok/weber-solver/master/docs/images/azimuthal-map.png" width="50%" height="50%">

- 点がいくつかのクラスタに分かれている場合，解は最も点の数が多いクラスタに寄る傾向があります．

  <img src="https://raw.githubusercontent.com/kymok/weber-solver/master/docs/images/cluster.png" width="50%" height="50%">
