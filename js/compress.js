
var boundary_index = [
  [-1, 0, 0],
  [+1, 0, 0],
  [0, -1, 0],
  [0, +1, 0],
  [0, 0, -1],
  [0, 0, +1],
];

var isBoundary = function (volume, dims, isovalue, cell) {
  var voxel = ((cell[2]) * dims[1] + cell[1]) * dims[0] + cell[0]
  var cellSign = Math.sign(volume[voxel] - isovalue);
  for (var i = 0; i < boundary_index.length; ++i) {
    var v = boundary_index[i];
    var currentVoxel = ((cell[2] + v[2]) * dims[1] + cell[1] + v[1]) * dims[0] + cell[0] + v[0];
    var currentcellSign = Math.sign(volume[currentVoxel] - isovalue);
    if (currentcellSign != cellSign) {
      return true;
    }
  };
  return false;
}

// Run the Marching Cubes algorithm on the volume to compute
// the isosurface at the desired value. The volume is assumed
// to be a Uint8Array, with one uint8 per-voxel.
// Dims should give the [x, y, z] dimensions of the volume
var compress = function (volume, resultVolume, dims, isovalue) {
  for (var k = 0; k < dims[2] - 1; ++k) {
    for (var j = 0; j < dims[1] - 1; ++j) {
      for (var i = 0; i < dims[0] - 1; ++i) {
        var voxel = (k * dims[1] + j) * dims[0] + i;
        if (isBoundary(volume, dims, isovalue, [i, j, k])) {
          resultVolume[voxel] = volume[voxel];
        } else {
          resultVolume[voxel] = volume[voxel] > isovalue ? 255 : 0;
        }
      }
    }
  }
  return resultVolume;
}

