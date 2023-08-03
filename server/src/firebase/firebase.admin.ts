import * as admin from 'firebase-admin'

import serviceAccount from './service.json'
import { ServiceAccount } from 'firebase-admin'

const sa : ServiceAccount = {
    projectId : serviceAccount.project_id,
    clientEmail : serviceAccount.client_email,
    privateKey : serviceAccount.private_key
}

const certPath =  admin.credential.cert(sa)

admin.initializeApp({
    credential :certPath
})


export {admin}

