import { Webhook } from "svix"
import userModel from "../models/userModel.js";

//API controller Function to Manage User with database

//http://localhost:4000/api/user/webhooks
const clerkWebhooks = async (req, res) =>{
      try {

        //create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body),{
            "svi-id":req.headers["svix-id"],
            "svi-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })

        const {data, type} = req.body

        switch(type){ 
            case"user.created":{

                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    photo: data.image_url,
                    firstName: data.first_name,
                    lastName: data.last_name
                }

                await UserModel.create(userData);
                res.json({
                    success:true,
                    message:"User Created Successfully"
                })  

                break;
            }
            case"user.updated":{
      const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    photo: data.image_url,
                    firstName: data.first_name,
                    lastName: data.last_name
                }
                await userModel.findOneAndUpdate(
                    {clerkId:data.id},
                    userData,
                    {new:true}
                )
                res.json({
                    success:true,
                    message:"User Updated Successfully"
                })

                break;
            }
            case"user.deleted":{
                await userModel.findOneAndUpdate({clerkId:data.id})
                res.json({
                    success:true,
                    message:"User Deleted Successfully"
                })
                break;
            }
            
            default:
                break;
        }

      }catch(error){
        console.error(error.message)
        res.json({
          success:false,
          message:error.message
        })

      } 
}

export { clerkWebhooks }