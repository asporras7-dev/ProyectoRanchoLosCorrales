const db = require('./config/db');
const Categoria = require('./models/Categoria');
const ServicioAdicional = require('./models/ServicioAdicional');

const categoriasServicios = [
  {
    titulo: "Decoración",
    items: ["Montaje de tela", "Villa Antebala", "Cuartos de Mesa", "Mesa Principal", "Cortinas en mesa", "Globos fotográfica", "Loubar"],
  },
  {
    titulo: "Entretenimiento",
    items: ["Animación", "DJ", "Decorativos", "Payasoría", "Inflables"],
  },
  {
    titulo: "Agroteca y bebidas",
    items: ["Pistas", "Coctelería", "Mesa Dulce", "Charcutería"],
  },
  {
    titulo: "Tecnología",
    items: ["Proyector", "Sonido", "Iluminación", "Karaoke"],
  },
  {
    titulo: "Documentación",
    items: ["Fotografía", "Videografía"],
  },
];

async function seed() {
    try {
        await db.authenticate();
        console.log('Connected to DB. Syncing models...');
        
        // We do not drop tables, just insert ignore or similar.
        // We will insert categories and retrieve their IDs.
        
        for (const cat of categoriasServicios) {
            // Find or create category
            const [categoriaItem, created] = await Categoria.findOrCreate({
                where: { nombre_Cat: cat.titulo }
            });
            
            const categoryId = categoriaItem.idCategoria;
            console.log(`Categoria: ${cat.titulo} (ID: ${categoryId})`);
            
            for (const itemName of cat.items) {
                await ServicioAdicional.findOrCreate({
                    where: { nombre: itemName, categoriaId: categoryId },
                    defaults: { descripcion: itemName }
                });
            }
        }
        
        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
