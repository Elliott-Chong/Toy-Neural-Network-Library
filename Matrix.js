class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];
    for (let i = 0; i < this.rows; i++) {
      this.data[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }

  show() {
    console.table(this.data);
  }

  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.floor(Math.random() * 2 - 1);
      }
    }
  }

  static fromArray(arr) {
    let resultingMatrix = new Matrix(arr.length, 1);
    for (let i = 0; i < resultingMatrix.rows; i++) {
      resultingMatrix.data[i] = [];
      for (let j = 0; j < resultingMatrix.cols; j++) {
        resultingMatrix.data[i][j] = arr[i];
      }
    }
    return resultingMatrix;
  }

  static toArray(m) {
    let res = [];
    Matrix.map(m, (elt) => res.push(elt));
    return res;
  }

  static subtract(a, b) {
    if (a.rows != b.rows || a.cols != b.cols) {
      console.error("Error subtract operation");
      return -1;
    }
    let resultingMatrix = new Matrix(a.rows, a.cols);
    for (let i = 0; i < resultingMatrix.rows; i++) {
      for (let j = 0; j < resultingMatrix.cols; j++) {
        resultingMatrix.data[i][j] = a.data[i][j] - b.data[i][j];
      }
    }
    return resultingMatrix;
  }

  static add(m, n) {
    let resultingMatrix = new Matrix(m.rows, m.cols);
    if (m instanceof Matrix && n instanceof Matrix) {
      if (m.rows != n.rows || m.cols != n.cols) {
        console.error(
          "Invalid Add Operation, matrices do not have the same dimensions."
        );
        return -1;
      }
      for (let i = 0; i < n.rows; i++) {
        for (let j = 0; j < n.cols; j++) {
          resultingMatrix.data[i][j] += m.data[i][j] + n.data[i][j];
        }
      }
    } else {
      for (let i = 0; i < m.rows; i++) {
        for (let j = 0; j < m.cols; j++) {
          resultingMatrix.data[i][j] += m.data[i][j] + n;
        }
      }
    }
    return resultingMatrix;
  }

  static map(m, cb) {
    let resultingMatrix = new Matrix(m.rows, m.cols);
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        resultingMatrix.data[i][j] = cb(m.data[i][j]);
      }
    }
    return resultingMatrix;
  }

  static transpose(m) {
    let resultingMatrix = new Matrix(m.cols, m.rows);
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        resultingMatrix.data[j][i] = m.data[i][j];
      }
    }
    return resultingMatrix;
  }

  static multiply(n, m) {
    if (!n instanceof Matrix || !m instanceof Matrix) {
      console.error("One or both of the inputs are not matrices");
      return -1;
    }

    if (n.cols != m.rows) {
      console.error(
        "Invalid Multiplication Operation, matrices are not comformable."
      );
      return -1;
    }

    let resultingMatrix = new Matrix(n.rows, m.cols);

    for (let i = 0; i < resultingMatrix.rows; i++) {
      for (let j = 0; j < resultingMatrix.cols; j++) {
        for (let k = 0; k < n.cols; k++) {
          resultingMatrix.data[i][j] += n.data[i][k] * m.data[k][j];
        }
      }
    }

    return resultingMatrix;
  }

  static hadamardProduct(n, m) {
    if (n.rows != m.rows || n.cols != m.cols) {
      console.error("no");
    }
    let resultingMatrix = new Matrix(n.rows, n.cols);
    for (let i = 0; i < n.rows; i++) {
      for (let j = 0; j < n.cols; j++) {
        resultingMatrix.data[i][j] = n.data[i][j] * m.data[i][j];
      }
    }
    return resultingMatrix;
  }
}
