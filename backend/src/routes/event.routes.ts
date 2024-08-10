import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import convertFileToBase64 from "../middleware/convertFile.middleware";

export const eventRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }, 
    Variables: {
        mainId: number;
    }
}>



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
            datasourceUrl: c.env.DATABASE_URL 
        });

        const adminId = c.get('mainId'); 
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


        return c.json(newEvent);
    } catch (error) {
        console.error('Error adding event:', error);
        return c.json({ error: 'Failed to add event' }, 500);
    }
});

eventRouter.put("/editEvent/:id", async (c) => {
    try{
        const formData = await c.req.formData();
        const eventId = c.req.param("id")
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const adminId = c.get('mainId')
        const admin = await prisma.admin.findFirst({
            where: {
                id: adminId
            }
        })

        if (!admin){
            return c.text('You are not authorized to add an event.');
        }

        const imageData = formData.get('image');
        if (!(imageData instanceof File)) {
            return c.text('No image file uploaded', { status: 400 });
        }

        const base64String = await convertFileToBase64(imageData);

        const event = await prisma.event.update({
            where: {
                organizerId: adminId,
                eventId: eventId
            },
            data: {
                eventName: formData.get('eventName') as string,
                description: formData.get('description') as string,
                venue: formData.get('venue') as string,
                time: new Date(formData.get('time') as string),
                price: parseInt(formData.get('price') as string, 10),
                category: formData.get('category') as string,
                image: base64String,
                contact: formData.get('contact') as string | null,
                minAge: parseInt(formData.get('minAge') as string, 10)
            }
        })

        if (!event){
            return c.text("Invalid")
        }
        return c.text(event.eventId)
    } catch (err) {
        return c.json({err})
    }
})

eventRouter.delete("/deleteEvent/:id", async (c) => {
    try{
        const eventId = c.req.param("id")
        
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        
        const adminId = c.get('mainId')
        const admin = await prisma.admin.findFirst({
            where: {
                id: adminId
            }
        })

        if (!admin){
            return c.text('You are not authorized to add an event.');
        }

        const event = await prisma.event.delete({
            where: {
                organizerId: adminId,
                eventId: eventId
            }
        })

        if (!event){
            return c.text("Invalid")
        }

        return c.text(event.eventId)
    } catch(err){
        return c.json({err})
    }
})

eventRouter.get("/allEvents", async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
      const event = await prisma.event.findMany();
  
      if (!event) {
        return c.json({ error: 'Event not found' });
      }
  
      return c.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      return c.json({ error: 'Failed to fetch event' });
    }
})

eventRouter.get("/adminEvents", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const adminId = c.get('mainId')
    const admin = await prisma.admin.findFirst({
        where: {
            id: adminId
        }
    })

    if (!admin){
        return c.text("You are not authorized.")
    }

    const events = await prisma.event.findMany({
        where: {
            organizerId: adminId
        }
    })

    if (!event){
        return c.text("No event exists")
    }

    return c.json({events})
}) 

eventRouter.get('/:eventId', async (c) => {
    const eventId = c.req.param("eventId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
      const event = await prisma.event.findUnique({
        where: {
          eventId: eventId
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