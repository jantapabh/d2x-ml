import os
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from sklearn.svm import SVC
from sklearn.metrics import plot_roc_curve
import sys
import json
import ast
import random


def cal(data):
    print(data)
    print("S1.5")
    model.predictions = model.fitted.predict([data])
    print(model.predictions)
    result = model.predictions
    return result


app = Flask(__name__)
api = Api(app)


if __name__ == '__main__':
    file_path = "./data"
    print("ML RUNNING")
    in_data = json.load(sys.stdin)
    label = in_data[0]
#     label = [
#   'choice1',  'choice2',  'choice3',
#   'choice4',  'choice5',  'choice6',
#   'choice7',  'choice8',  'choice9',
#   'choice10', 'choice11', 'choice12',
#   'choice13', 'choice14', 'choice15',
#   'choice16', 'choice17', 'choice18',
#   'choice19', 'choice20', 'choice21',
#   'choice22'
# ]
    disease_id = in_data[1]
    # disease_id = 1
    name_file = 'file'
    name_file += str(disease_id)
    name_file += '.csv'
    data = pd.read_csv(os.path.join(file_path, name_file))
    print(file_path)
    print(name_file)

    num = random.randint(0, 100)

    data.features = data[label]
    data.targets = data.answer
    print(data.features)
    # print(data.targets)
    
    class FindResult(Resource):
        def get(self):
            return {'message': (disease_id*1000)+148, 'num': num }, 200
        def post(self):
            print(file_path)
            print(name_file)
            body = request.get_json()
            print("S1")
            # return {'result':body}, 200
            a = cal(body['code'])
            print("S2")

            c = pd.Series(a).to_json(orient='values')
            print("S3")

            d = c.split("[")[1].split("]")[0]
            print("S4")

            return {'result': int(d)}, 200

    api.add_resource(FindResult, '/')

  
    feature_train, feature_test, target_train, target_test = train_test_split(data.features, data.targets)

    model = DecisionTreeClassifier(criterion='entropy', presort=True)

    model.fitted = model.fit(feature_train, target_train)

    model.predictions = model.fitted.predict(feature_test)
    print(model.predictions)
    print(confusion_matrix(target_test, model.predictions))
    print("Accuracy : ", accuracy_score(target_test, model.predictions)*100, " %")

    print((disease_id*1000)+148)
    
    
    app.run(port=(disease_id*1000)+148, debug=False)
