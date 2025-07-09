from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    op = data['operation']
    
    try:
        a = np.array(data['matrixA'])
        b = np.array(data['matrixB']) if 'matrixB' in data else None

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
        elif op == 'determinantA':
            if a.shape[0] != a.shape[1]:
                return jsonify({'error': 'Matrix A must be square for determinant'}), 400
            result = np.linalg.det(a)
        elif op == 'determinantB':
            if b.shape[0] != b.shape[1]:
                return jsonify({'error': 'Matrix B must be square for determinant'}), 400
            result = np.linalg.det(b)
        elif op == 'inverseA':
            if a.shape[0] != a.shape[1]:
                return jsonify({'error': 'Matrix A must be square for inverse'}), 400
            result = np.linalg.inv(a)
        elif op == 'inverseB':
            if b.shape[0] != b.shape[1]:
                return jsonify({'error': 'Matrix B must be square for inverse'}), 400
            result = np.linalg.inv(b)
        elif op == 'scalarA':
            scalar = data.get('scalar', 1)
            result = scalar * a
        elif op == 'scalarB':
            scalar = data.get('scalar', 1)
            result = scalar * b
        elif op == 'rankA':
            result = int(np.linalg.matrix_rank(a))
        elif op == 'rankB':
            result = int(np.linalg.matrix_rank(b))
        elif op == 'adjointA':
            if a.shape[0] != a.shape[1]:
                return jsonify({'error': 'Matrix A must be square for adjoint'}), 400
            cofactors = np.linalg.inv(a).T * np.linalg.det(a)
            result = cofactors
        elif op == 'adjointB':
            if b.shape[0] != b.shape[1]:
                return jsonify({'error': 'Matrix B must be square for adjoint'}), 400
            cofactors = np.linalg.inv(b).T * np.linalg.det(b)
            result = cofactors
        else:
            return jsonify({'error': 'Invalid operation'}), 400

        return jsonify({'result': result.tolist() if isinstance(result, np.ndarray) else result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)