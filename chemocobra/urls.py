from django.contrib import admin
from django.urls import path, include
from api import metabolic_views

metabolic_urls = [
    path('see_available_models/',metabolic_views.GetAvailableModels.as_view(),name='see_available_models'),
    path('get_model/',metabolic_views.GetModel.as_view(),name='get_model'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('metabolic/', include(metabolic_urls))

]
