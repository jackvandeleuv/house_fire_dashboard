import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
import pandas as pd
import plotly.express as px

df = pd.read_csv('data/processed/dashboard.csv', sep=',')

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

fig = px.scatter_geo(df, lat='LATITUDE', lon='LONGITUDE',
                     color='AVG_SCORE',
                     hover_name='CITYSTATE',
                     labels={'COUNT_111': 'Building Fire Count', 
                             'MULTI_INSPECTION_SCORE': 'Multifamily Inspection Score'},
                     title='Inspection Score and Incident Count by City State',
                     scope='usa',
                     size_max=30)  

fig.update_geos(showcountries=True, 
                countrycolor="Black", 
                showsubunits=True, 
                subunitcolor="Black", 
                subunitwidth=1)

app.layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H1("Inspection Score and Incident Count by City State"),
        ]),
    ]),
    dbc.Row([
        dbc.Col([
            dcc.Graph(id='geo_map', figure=fig, style={'width': '100%', 'height': '80vh'}),
        ], width=12), 
    ]),
])

if __name__ == "__main__":
    app.run_server(debug=True)
