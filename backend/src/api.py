import os
from flask import Flask, request, jsonify, abort
from sqlalchemy import exc
import json
from flask_cors import CORS

from .database.models import db_drop_and_create_all, setup_db, Drink
from .auth.auth import AuthError, requires_auth

app = Flask(__name__)
setup_db(app)
CORS(app)

db_drop_and_create_all()

# ROUTES
@app.route('/drinks', methods=['GET'], endpoint='get_drinks')
def drinks():
    try:
        return json.dumps({
            'success':
            True,
            'drinks': [drink.short() for drink in Drink.query.all()]
        }), 200
    except:
        return json.dumps({
            'success': False,
            'error': "An error occurred"
        }), 500


@app.route('/drinks-detail', methods=['GET'], endpoint='drinks_detail')
@requires_auth('get:drinks-detail')
def drinks_detail(f):
    try:
        return json.dumps({
            'success':
            True,
            'drinks': [drink.long() for drink in Drink.query.all()]
        }), 200
    except:
        return json.dumps({
            'success': False,
            'error': "An error occurred"
        }), 500


@app.route('/drinks', methods=['POST'], endpoint='post_drink')
@requires_auth('post:drinks')
def drinks(f):
    data = dict(request.form or request.json or request.data)
    drink = Drink(title=data.get('title'),
                  recipe=data.get('recipe') if type(data.get('recipe')) == str
                  else json.dumps(data.get('recipe')))
    try:
        drink.insert()
        return json.dumps({'success': True, 'drink': drink.long()}), 200
    except:
        return json.dumps({
            'success': False,
            'error': "An error occurred"
        }), 500


@app.route('/drinks/<id>', methods=['PATCH'], endpoint='patch_drink')
@requires_auth('patch:drinks')
def drinks(f, id):
    try:
        data = dict(request.form or request.json or request.data)
        drink = drink = Drink.query.filter(Drink.id == id).one_or_none()
        if drink:
            drink.title = data.get('title') if data.get(
                'title') else drink.title
            recipe = data.get('recipe') if data.get('recipe') else drink.recipe
            drink.recipe = recipe if type(recipe) == str else json.dumps(
                recipe)
            drink.update()
            return json.dumps({'success': True, 'drinks': [drink.long()]}), 200
        else:
            return json.dumps({
                'success':
                False,
                'error':
                'Drink #' + id + ' not found to be edited'
            }), 404
    except:
        return json.dumps({
            'success': False,
            'error': "An error occurred"
        }), 500


@app.route('/drinks/<id>', methods=['DELETE'], endpoint='delete_drink')
@requires_auth('patch:drinks')
def drinks(f, id):
    try:
        drink = drink = Drink.query.filter(Drink.id == id).one_or_none()
        if drink:
            drink.delete()
            return json.dumps({'success': True, 'drink': id}), 200
        else:
            return json.dumps({
                'success':
                False,
                'error':
                'Drink #' + id + ' not found to be deleted'
            }), 404
    except:
        return json.dumps({
            'success': False,
            'error': "An error occurred"
        }), 500


# Error Handling
'''
Example error handling for unprocessable entity
'''


@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
        "success": False,
        "error": 422,
        "message": "unprocessable"
    }), 422

@app.errorhandler(400)
def unprocessable(error):
    return jsonify({
        "success": False,
        "error": 400,
        "message": "Check the body request"
    }), 400

@app.errorhandler(404)
def unprocessable(error):
    """
     Propagates the formatted 404 error to the response
     """
    return jsonify({
        "success": False,
        "error": 404,
        "message": "resource not found"
    }), 404


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response
