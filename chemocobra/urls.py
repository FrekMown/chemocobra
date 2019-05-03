from django.contrib import admin
from django.urls import path, include
from api import metabolic_views

metabolic_urls = [
    path('see_available_models/',metabolic_views.GetAvailableModels.as_view(),name='see_available_models'),
    path('get_model/',metabolic_views.GetModel.as_view(),name='get_model'),
    path('run_fva/',metabolic_views.RunFVA.as_view(),name='run_fva'),
    path('run_pfba/',metabolic_views.RunpFBA.as_view(),name='run_pfba'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('metabolic/', include(metabolic_urls))

]
