const path = require("path")
const fs = require("fs")

function createReactRouter6Routes(routesPath = "./routes") {
  console.log(path.resolve(routesPath))
  // const rootPath = path.resolve(process.cwd(), "src")
  // const routesRootPath = path.resolve(rootPath, routesPath)
  // const entries = fs.readdirSync(routesRootPath)
  // for (let entry of entries) {
  //   const filepath = path.resolve(routesRootPath, entry)
  //   const stat = fs.statSync(filepath)
  //   console.log(stat.isDirectory())
  // }
}

createReactRouter6Routes()