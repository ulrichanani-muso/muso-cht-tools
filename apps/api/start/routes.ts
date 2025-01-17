/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('me/profile', 'AuthController.profile')
  Route.resource('cht-instances', 'ChtInstancesController').apiOnly()
  Route.get('rename/contact', 'RenamesController.getTemplate')
  Route.post('rename/contact', 'RenamesController.initiateRenaming')
  Route.get('rename/contact/result/:instanceId/:jobId', 'RenamesController.getRenamingResult')
  Route.get('rename/contact/:instanceId/:jobId', 'RenamesController.getRenamingProgress')
  Route.get('move/contact', 'MovesController.getTemplate')
  Route.post('move/contact', 'MovesController.initiateMoving')
  Route.get('move/contact/result/:instanceId/:jobId', 'MovesController.getMovingResult')
  Route.get('move/contact/:instanceId/:jobId', 'MovesController.getMovingProgress')
})
  .prefix('/api')
  .middleware(['auth'])
  