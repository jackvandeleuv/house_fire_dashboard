import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
import pandas as pd
import plotly.express as px

WORKING_DIRECTOR = 'D:/Fire Project/'
df = pd.read_csv('data/processed/dashboard.csv', sep=',')
df = df[df.POPULATION.notna()]
df = df[df['111_COUNT'].notna()]

from sklearn.preprocessing import StandardScaler
df['COLOR'] = df['111_COUNT'] / df.POPULATION
df.COLOR = StandardScaler.fit_transform(df.COLOR)

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

fig = px.scatter_geo(df, lat='LATITUDE_x', lon='LONGITUDE_x',
                     color='COLOR',
                     hover_name='CITYSTATE',
                     labels={'111_COUNT': 'Building Fire Count', 
                             'MULTI_INSPECTION_SCORE': 'Multifamily Inspection Score'},
                     title='Inspection Score and Incident Count by City State',
                     scope='usa',
                     size_max=30)  # Add size_max parameter to limit the marker size

fig.update_geos(showcountries=True, countrycolor="Black", showsubunits=True, subunitcolor="Black", subunitwidth=1)

app.layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H1("Inspection Score and Incident Count by City State"),
        ]),
    ]),
    dbc.Row([
        dbc.Col([
            dcc.Graph(id='geo_map', figure=fig, style={'width': '100%', 'height': '80vh'}),  # Adjust width and height of the graph
        ], width=12),  # Set the width parameter to make the column take up 100% of the available width
    ]),
])

if __name__ == "__main__":
    app.run_server(debug=True)
