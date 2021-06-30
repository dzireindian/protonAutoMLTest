import io
import base64
import joblib
import pprint

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import category_encoders as ce

from pandas.plotting import scatter_matrix
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score

dataframe = pd.read_csv("titanic.csv")
figures = dict()
model = None


def plotter():
    my_stringIObytes = io.BytesIO()
    plt.savefig(my_stringIObytes, format='jpg')
    my_stringIObytes.seek(0)
    my_base64_jpgData = base64.b64encode(my_stringIObytes.read())
    # print(my_base64_jpgData)

    return my_base64_jpgData


def prediction(array):
    global model, dataframe
    # a = np.asarray(array).reshape(1, -1)
    print(array)
    predicted_value = model.predict(a)
    dataframe.iloc[-1, dataframe.columns.get_loc('Survived')] = predicted_value
    return predicted_value


def create_model(df):
    global dataframe

    y = None
    drop_list = ['Survived', 'Name', 'Ticket', 'Cabin']

    if isinstance(df, pd.DataFrame):
        y = pd.Series(df['Survived'])
    else:
        df["Survived"] = "TEMP"
        dataframe = dataframe.append(df)
        df = pd.DataFrame(df)
        drop_list = ['Name', 'Ticket', 'Cabin']

    X = df.drop(drop_list, axis=1)

    encoder = ce.OneHotEncoder(handle_unknown='return_nan', return_df=True, use_cat_names=True)
    X = encoder.fit_transform(X)
    X = X.to_numpy()
    print(X)
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    return X, y


def initial_code():
    global dataframe, figures, model
    df = dataframe.copy(deep=True)

    ser = df.isna().sum()
    ser_dict = ser.to_dict()

    # print(list(df['Sex'].unique()))
    # print(list(df['Embarked'].unique()))

    data_types = df.dtypes.apply(lambda x: "number" if (str(x) == "int64" or "float64" == str(x)) else "text")
    data_types = data_types.to_dict()
    del data_types['Survived']
    data_types = data_types.items()

    input_fields = list(data_types)
    figures['inputs'] = input_fields

    figures['gender'] = df['Sex'].unique()
    figures['Embarked'] = df['Embarked'].dropna().unique()

    for label, value in ser_dict.items():
        if value < 5:
            df.dropna(subset=[label], inplace=True)
        elif value > 5 and value < 600:
            df[label] = df[label].fillna(df[label].mean())
        elif value > 600:
            df[label] = df[label].fillna('NA')

    # df.dtypes.apply(lambda x: print(str(x)))

    num_cols = df.select_dtypes([np.int64, np.float64]).columns.tolist()

    col_histograms = list()

    for col in num_cols:
        df.hist(column=col)
        my_base64_jpgData = plotter()
        col_histograms.append(my_base64_jpgData)

    scatter_matrix(df[num_cols], figsize=(50, 50))
    my_base64_jpgData = plotter()

    figures['columns'] = col_histograms
    figures['scatter_matrix'] = my_base64_jpgData

    obj_cols = df.select_dtypes([np.object]).columns.tolist()

    for col in obj_cols:
        df[col].value_counts().plot(kind='bar')

    my_base64_jpgData = plotter()
    figures['object_columns'] = my_base64_jpgData

    X, y = create_model(df)
    model = RandomForestClassifier()
    # model.fit(X_train, y_train)
    model.fit(X, y)
    joblib.dump(model, "model_joblib")
    loaded_model = joblib.load("model_joblib")

    model = loaded_model


initial_code()
print(figures['inputs'])
# pprint.pprint(figures)