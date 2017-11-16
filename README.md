# Simple Weber Problem Solver

## Demo

https://kymok.github.io/weber-solver/

## Weber Problem

Given a set of (point, weight) pairs, find a point that minimizes the sum of weighted distances to the set of points. A simple steepest descent algorithm is used in this demo.


## Usage

- Click on the map to place markers.
- Drag an existing marker to adjust its location.
- Click on an existing marker to delete the marker.
- (Optional) Select a weight function:
  - none: minimize sum of distances.
  - distance: minimize sum of squared distance.


## Examples

- Weber point of {Tokyo, New York, London} is near Iceland. (Azimuthal Map image is from [Azimuthal Map, Anywhere](http://maps.ontarget.cc/azmap/en.html).)

  <img src="https://raw.githubusercontent.com/kymok/weber-solver/master/docs/images/tokyo-ny-london.png" width="50%" height="50%">

  <img src="https://raw.githubusercontent.com/kymok/weber-solver/master/docs/images/azimuthal-map.png" width="50%" height="50%">

- If points are divided into several clusters, Weber point tend to approach the largest cluster.

  <img src="https://raw.githubusercontent.com/kymok/weber-solver/master/docs/images/cluster.png" width="50%" height="50%">
