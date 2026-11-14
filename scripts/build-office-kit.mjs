// Builds public/office/office-kit.glb: the Kenney CC0 furniture the hero scene uses, as one file.
// Each model becomes a named node, scaled to metres (10 model units = 1 m), centred on its
// footprint and standing on y = 0. Materials keep their Kenney names so the scene can recolour them.
//
//   node scripts/build-office-kit.mjs <folder with the Kenney .obj/.mtl files>
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const MODELS = [
  'desk', 'chairDesk', 'computerScreen', 'computerKeyboard', 'computerMouse',
  'pottedPlant', 'plantSmall2', 'bookcaseOpen', 'bookcaseOpenLow', 'rugRectangle', 'trashcan',
]

const source = process.argv[2]
if (!source) {
  console.error('Usage: node scripts/build-office-kit.mjs <folder with the Kenney .obj/.mtl files>')
  process.exit(1)
}

// GLTFExporter reads its binary chunks through FileReader, which Node does not have.
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => { this.result = buffer; this.onloadend?.() })
  }
}

const scene = new THREE.Scene()
const sizes = {}
for (const name of MODELS) {
  const [mtlText, objText] = await Promise.all([
    readFile(path.join(source, `${name}.mtl`), 'utf8'),
    readFile(path.join(source, `${name}.obj`), 'utf8'),
  ])
  const materials = new MTLLoader().parse(mtlText, '')
  materials.preload()
  const obj = new OBJLoader().setMaterials(materials).parse(objText)
  const toStandard = (m) => {
    const mat = new THREE.MeshStandardMaterial({ color: m.color, roughness: 0.8, metalness: 0 })
    mat.name = m.name
    return mat
  }
  obj.traverse((o) => {
    // Only the wrapper keeps a name, so the loader finds each model by it.
    o.name = ''
    if (!o.isMesh) return
    // No textures, so no UVs; indexing the flat-shaded faces roughly halves the file.
    o.geometry.deleteAttribute('uv')
    o.geometry = mergeVertices(o.geometry)
    o.material = Array.isArray(o.material) ? o.material.map(toStandard) : toStandard(o.material)
  })
  obj.scale.setScalar(0.1)
  obj.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(obj)
  const centre = box.getCenter(new THREE.Vector3())
  obj.position.set(-centre.x, -box.min.y, -centre.z)
  const node = new THREE.Group()
  node.name = name
  node.add(obj)
  scene.add(node)
  const size = box.getSize(new THREE.Vector3())
  sizes[name] = [size.x, size.y, size.z].map((n) => Number(n.toFixed(3)))
}

const glb = await new GLTFExporter().parseAsync(scene, { binary: true })
const outDir = path.resolve('public/office')
await mkdir(outDir, { recursive: true })
await writeFile(path.join(outDir, 'office-kit.glb'), Buffer.from(glb))
await copyFile(path.join(source, '..', 'LICENSE-kenney-furniture.txt'), path.join(outDir, 'LICENSE-kenney-furniture.txt'))
console.log(`office-kit.glb: ${(glb.byteLength / 1024).toFixed(1)} KB, ${MODELS.length} models`)
console.log(JSON.stringify(sizes))
