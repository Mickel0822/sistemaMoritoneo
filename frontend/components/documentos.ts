// filepath: c:\Users\admin\Desktop\Jordy\Quinto\Web Avanzado\Recuperacion_Sistema_3Algoritmos\sistema-monitoreo-atencion\frontend\components\documentos.ts
/**
 * Este archivo exporta los textos de los tres documentos fijos
 * para el sistema de monitoreo de atención.
 * Cada documento es un string plano, sin formato HTML.
 * Puedes cambiar los textos por otros de tu preferencia.
 */

export type DocKey = 'corto' | 'mediano' | 'extenso';

export const documentos: Record<DocKey, string> = {
  corto: `
La fotosíntesis es el proceso mediante el cual las plantas, las algas y algunas bacterias convierten la energía solar en energía química. Este proceso ocurre principalmente en las hojas, dentro de unas estructuras llamadas cloroplastos. Durante la fotosíntesis, las plantas absorben dióxido de carbono del aire y agua del suelo. Utilizando la luz solar, transforman estos ingredientes en glucosa, que es un tipo de azúcar que les sirve de alimento, y liberan oxígeno como subproducto. La fotosíntesis es fundamental para la vida en la Tierra, ya que proporciona el oxígeno que respiramos y es la base de la cadena alimenticia.
  `,

  mediano: `
La Revolución Industrial fue un periodo de grandes cambios económicos, tecnológicos y sociales que comenzó en Gran Bretaña a mediados del siglo XVIII y se extendió por Europa y América. Antes de este periodo, la mayoría de las personas vivía en zonas rurales y trabajaba en la agricultura. Con la invención de máquinas como la máquina de vapor y el telar mecánico, la producción de bienes se trasladó a las fábricas, lo que permitió fabricar productos en grandes cantidades y a menor costo. Esto provocó el crecimiento de las ciudades, ya que muchas personas se mudaron para trabajar en las fábricas. La Revolución Industrial también trajo consigo importantes avances en el transporte, como el ferrocarril y los barcos de vapor, facilitando el comercio y la movilidad. Además, surgieron nuevas clases sociales y se transformaron las condiciones laborales, impulsando cambios en la educación y la política. Aunque este periodo trajo prosperidad y desarrollo, también generó desafíos sociales y ambientales que aún se estudian hoy en día.
  `,

  extenso: `
El sistema solar es el conjunto de cuerpos celestes que giran alrededor del Sol, nuestra estrella más cercana. Está compuesto por ocho planetas principales: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno, así como por planetas enanos, asteroides, cometas y una gran variedad de satélites. El Sol representa más del 99% de la masa total del sistema solar y es la fuente principal de energía para todos los planetas. La Tierra, el tercer planeta desde el Sol, es el único conocido que alberga vida, gracias a su atmósfera, agua líquida y condiciones adecuadas. Los planetas se dividen en dos grupos: los rocosos (Mercurio, Venus, Tierra y Marte) y los gaseosos (Júpiter, Saturno, Urano y Neptuno). Además, existen cinturones de asteroides y cometas que orbitan en trayectorias elípticas. El estudio del sistema solar ha permitido a la humanidad comprender mejor el origen y la evolución de los cuerpos celestes, así como nuestro lugar en el universo. Las misiones espaciales han explorado varios planetas y lunas, revelando datos sorprendentes sobre la composición, atmósfera y geología de estos mundos. El conocimiento del sistema solar sigue creciendo gracias a la observación astronómica y la exploración espacial, inspirando a futuras generaciones de científicos y exploradores.
  `
};