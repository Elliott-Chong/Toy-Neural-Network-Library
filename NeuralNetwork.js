const Matrix = require("./Matrix.js");
const fs = require("fs");

class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;

    this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes);
    this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hiddenNodes, 1);
    this.bias_o = new Matrix(this.outputNodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();

    this.learning_rate = 0.1;
  }

  activationFunction(input) {
    return 1 / (1 + Math.exp(-input));
  }

  fauxdSigmoig(y) {
    return y * (1 - y);
  }

  feedforward(inputsArr) {
    let inputs = Matrix.fromArray(inputsArr);
    this.weights_ih
    let hiddenOutput = Matrix.multiply(this.weights_ih, inputs);
    hiddenOutput = Matrix.add(hiddenOutput, this.bias_h);
    hiddenOutput = Matrix.map(hiddenOutput, this.activationFunction);

    let guesses = Matrix.multiply(this.weights_ho, hiddenOutput);
    guesses = Matrix.add(guesses, this.bias_o);
    guesses = Matrix.map(guesses, this.activationFunction);
    guesses = Matrix.map(guesses, (elt) => {
      return elt.toFixed(3);
    });
    return Matrix.toArray(guesses);
  }

  load(filename) {
    var weights = JSON.parse(fs.readFileSync(filename, "utf8"));
    this.weights_ih.data = weights.weights_ih;
    this.weights_ho.data = weights.weights_ho;
    this.bias_h.data = weights.bias_h;
    this.bias_o.data = weights.bias_o;
  }

  save(filename) {
    let weights = {
      weights_ih: this.weights_ih.data,
      weights_ho: this.weights_ho.data,
      bias_h: this.bias_h.data,
      bias_o: this.bias_o.data,
    };

    weights = JSON.stringify(weights);

    fs.writeFile(filename, weights, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  }

  train(inputsArr, targetsArr) {
    let inputs = Matrix.fromArray(inputsArr);
    let targets = Matrix.fromArray(targetsArr);

    //feedforward to get guesses
    let hiddenOutput = Matrix.multiply(this.weights_ih, inputs);
    hiddenOutput = Matrix.add(hiddenOutput, this.bias_h);
    hiddenOutput = Matrix.map(hiddenOutput, this.activationFunction);

    let guesses = Matrix.multiply(this.weights_ho, hiddenOutput);
    guesses = Matrix.add(guesses, this.bias_o);
    guesses = Matrix.map(guesses, this.activationFunction);

    // Find error vector for output layer
    let outputErrors = Matrix.subtract(targets, guesses);

    //find error vector for hidden layer
    let hiddenErrors = Matrix.multiply(
      Matrix.transpose(this.weights_ho),
      outputErrors
    );

    //adjust the weights for this.weights_ho
    let gradient_ho = Matrix.map(guesses, this.fauxdSigmoig);
    gradient_ho = Matrix.hadamardProduct(gradient_ho, outputErrors);
    let delta_weights_ho = Matrix.multiply(
      gradient_ho,
      Matrix.transpose(hiddenOutput)
    );

    this.weights_ho = Matrix.add(
      this.weights_ho,
      Matrix.map(delta_weights_ho, (elt) => elt * this.learning_rate)
    );
    //adjust the bias for the output layer
    this.bias_o = Matrix.add(this.bias_o, gradient_ho);

    //adjust the weights for this.weights_ih
    let gradient_ih = Matrix.map(hiddenOutput, this.fauxdSigmoig);
    // look through this
    gradient_ih = Matrix.hadamardProduct(gradient_ih, hiddenErrors);
    let delta_weights_ih = Matrix.multiply(
      gradient_ih,
      Matrix.transpose(inputs)
    );

    this.weights_ih = Matrix.add(
      this.weights_ih,
      Matrix.map(delta_weights_ih, (elt) => elt * this.learning_rate)
    );
    //adjust the bias for the hidden layer
    this.bias_h = Matrix.add(this.bias_h, gradient_ih);
  }
}

module.exports = NeuralNetwork;
