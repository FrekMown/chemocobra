from django.contrib import admin
from django.urls import path, include
from api import metabolic_views

metabolic_urls = [
    path('see_available_models/',metabolic_views.GetAvailableModels.as_view(),name='see_available_models'),
    path('get_model/',metabolic_views.GetModel.as_view(),name='get_model'),
    path('see_available_maps/',metabolic_views.GetAvailableMaps.as_view(),name='see_available_maps'),
    path('get_map/',metabolic_views.GetMap.as_view(),name='get_map'),
    path('run_fva/',metabolic_views.RunFVA.as_view(),name='run_fva'),
    path('run_pfba/',metabolic_views.RunpFBA.as_view(),name='run_pfba'),
]

urlpatterns = [
    path('', metabolic_views.MetabolicAppView.as_view(),name='metabolic_app'),
    path('admin/', admin.site.urls),
    path('metabolic/', include(metabolic_urls))
]
