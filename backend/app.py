from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    a = np.array(data['matrixA'])
    b = np.array(data['matrixB'])
    op = data['operation']

    try:
        if op == 'add':
            result = a + b
        elif op == 'subtract':
            result = a - b
        elif op == 'multiply':
            result = np.dot(a, b)
        elif op == 'transposeA':
            result = a.T
        elif op == 'transposeB':
            result = b.T
        else:
            return jsonify({'error': 'Invalid operation'}), 400

        return jsonify({'result': result.tolist()})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)