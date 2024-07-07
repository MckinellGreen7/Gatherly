import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import convertFileToBase64 from "../middleware/cloudinary.middleware";

export const eventRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }, 
    Variables: {
        mainId: number;
    }
}>

interface EventData {
    eventId?: string;    
    eventName: string;
    description: string;
    venue: string;
    time: string | Date;   
    price: number;         
    category: string;
    image?: string | null; 
    contact?: string | null;
    minAge: number;
    organizerId: number;   
}


eventRouter.use("/*",async (c,next) => {
    const authHeader = c.req.header("authorization") || ""
    try{
    const main = await verify(authHeader, c.env.JWT_SECRET)
    if (main){
        c.set('mainId', main.id)
        await next()
    }
    else{
        c.status(403)
        return c.json({
            message: "You are not logged in"
        })
    }
    } catch(err){
        c.status(403)
        return c.json({
            message: "You are not logged in"
        })
    }
})

eventRouter.post('/addEvent', async (c) => {
    try {
        const formData = await c.req.formData();
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL // Assuming DATABASE_URL is defined in Cloudflare environment
        });

        const adminId = c.get('mainId'); // Assuming mainId is retrieved from context (authentication)
        const admin = await prisma.admin.findFirst({
            where: {
                id: adminId
            }
        });

        if (!admin) {
            return c.text('You are not authorized to add an event.');
        }

        const imageData = formData.get('image');
        if (!(imageData instanceof File)) {
            return c.text('No image file uploaded', { status: 400 });
        }

        // Convert image file to Base64 string
        const base64String = await convertFileToBase64(imageData);

        const newEvent = await prisma.event.create({
            data: {
                eventName: formData.get('eventName') as string,
                description: formData.get('description') as string,
                venue: formData.get('venue') as string,
                time: new Date(formData.get('time') as string),
                price: parseInt(formData.get('price') as string, 10),
                category: formData.get('category') as string,
                image: base64String,
                contact: formData.get('contact') as string | null,
                minAge: parseInt(formData.get('minAge') as string, 10),
                organizerId: adminId,
            },
        });


        return c.json(newEvent); // Return the created event data
    } catch (error) {
        console.error('Error adding event:', error);
        return c.json({ error: 'Failed to add event' }, 500);
    }
});


eventRouter.get('/:eventId', async (c) => {
    const eventId = c.req.param("eventId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
      const event = await prisma.event.findUnique({
        where: {
          eventId: eventId
        },
        include: {
          // Include any related data you need here
        }
      });
  
      if (!event) {
        return c.json({ error: 'Event not found' });
      }
  
      return c.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      return c.json({ error: 'Failed to fetch event' });
    }
  });