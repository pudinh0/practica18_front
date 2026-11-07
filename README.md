¿cuánto se ahorró y por qué el ahorro es pequeño en esta aplicación?
el ahorro es pequeño por la aplicacion tiene pocasc paginas y codigo, asi como las dependencias compartidas compartidas como react, el lazy loadin separa el codigo de las paginas para descargarlo cuando se visita cada ruta, pero no elimina el codigo de la app.

¿por qué falla la API si el preview corre en el puerto 4173?
falla por el cors, el backend permite las solicitudes dede el puerto 5173 pero cuando se corre el npm
run preview sirve desde el puerto 4173, como son puertos y orignes distintos, el navegador bloquea
las respuesta de la api, se tendria que permitir el orgin del puerto 4173 en la configuracion
del cors para que funciones

¿cuándo conviene un contexto y cuándo un store?
Cuando context para compartir los datos estables entre componentes como la sesion o el idioma,
esto tambien por es sencillo y viene integrado en react

en la store conviene cuando el estado es mas dinamico o compartido por varias partes de la app,
ej: inscrepicones
ya que permite centralizar actualizaciones  y que cada componente se suscriba solo a los datos que necesita