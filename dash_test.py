import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
import pandas as pd
import plotly.express as px

df = pd.read_csv('multi_merged.csv', sep=',')

grouped_df = df.groupby('CITYSTATE').agg({'INSPECTION_SCORE': 'mean', 'INC_COUNT': 'sum', 'LATITUDE': 'mean', 'LONGITUDE': 'mean'}).reset_index()

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

fig = px.scatter_geo(grouped_df, lat='LATITUDE', lon='LONGITUDE',
                     color='INC_COUNT',
                     hover_name='CITYSTATE',
                     labels={'INC_COUNT': 'Incident Count', 'INSPECTION_SCORE': 'Inspection Score'},
                     title='Inspection Score and Incident Count by City State',
                     scope='usa',
                     size_max=30)  # Add size_max parameter to limit the marker size

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
