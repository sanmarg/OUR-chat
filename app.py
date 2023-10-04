from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = '10c3f66f2155dbb76bb54c73c4a94bde0890a8d632599f92'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(data):
    username = data['username']
    message = data['message']
    timestamp = data['timestamp']
    print(f'Message from {username} at {timestamp}: {message}')
    emit('message', {'username': username, 'timestamp': timestamp, 'message': message}, broadcast=True)

@socketio.on('reaction')
def handle_reaction(data):
    username = data['username']
    reaction = data['reaction']
    print(f'{username} reacted with {reaction}')
    emit('reaction', {'username': username, 'reaction': reaction}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000)