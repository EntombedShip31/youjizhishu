from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder='assets', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/spot')
def spot():
    return render_template('spot.html')

@app.route('/detail')
def detail():
    return render_template('detail.html')

@app.route('/community')
def community():
    return render_template('community.html')

@app.route('/plan')
def plan():
    return render_template('plan.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')



# 处理静态资源
@app.route('/assets/<path:filename>')
def static_files(filename):
    return send_from_directory('assets', filename)

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('DEBUG', 'False').lower() == 'true')