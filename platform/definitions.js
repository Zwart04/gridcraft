export const PRODUCTS = {
  "gridcraft": {
    "accent": "#d7bd59",
    "currency": "IDR",
    "tagline": "Build worlds. Play your ideas.",
    "modules": [
      {
        "key": "projects",
        "label": "Proyek",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "description",
            "label": "Deskripsi",
            "type": "textarea"
          },
          {
            "key": "deadline",
            "label": "Target selesai",
            "type": "date"
          }
        ],
        "statuses": [
          "planning",
          "active",
          "review",
          "done"
        ]
      },
      {
        "key": "levels",
        "label": "Level",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "width",
            "label": "Lebar tile",
            "type": "number",
            "min": 4,
            "max": 64
          },
          {
            "key": "height",
            "label": "Tinggi tile",
            "type": "number",
            "min": 4,
            "max": 64
          },
          {
            "key": "cells",
            "label": "Data tile",
            "type": "json"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "entities",
        "label": "Entity",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "level_id",
            "label": "Level",
            "type": "ref",
            "ref": "levels",
            "required": true
          },
          {
            "key": "type",
            "label": "Jenis",
            "type": "select",
            "options": [
              "player",
              "obstacle",
              "collectible",
              "goal"
            ]
          },
          {
            "key": "x",
            "label": "X tile",
            "type": "number",
            "min": 0,
            "max": 63
          },
          {
            "key": "y",
            "label": "Y tile",
            "type": "number",
            "min": 0,
            "max": 63
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "assets",
        "label": "Asset library",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "description",
            "label": "Deskripsi",
            "type": "textarea"
          },
          {
            "key": "color",
            "label": "Warna",
            "type": "color"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "shaders",
        "label": "Shader",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "content",
            "label": "GLSL fragment shader",
            "type": "code",
            "required": true
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "versions",
        "label": "Versi proyek",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "content",
            "label": "Snapshot JSON",
            "type": "json"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "level-editor",
        "label": "Level editor & playtest",
        "tool": "grid-editor",
        "fields": []
      },
      {
        "key": "shader-editor",
        "label": "Shader editor",
        "tool": "shader-editor",
        "fields": []
      },
      {
        "key": "reports",
        "label": "Laporan",
        "tool": "reports",
        "fields": [],
        "statuses": []
      }
    ],
    "id": "gridcraft",
    "name": "GridCraft Engine",
    "purpose": "Editor game 2D dengan level, tile, entity, shader dan playtest di dalam proyek yang sama.",
    "sources": [
      "gridcraft",
      "shaderforge"
    ],
    "workflow": "Proyek → gambar level → atur entity/layer → shader → playtest dengan collision → simpan versi → ekspor JSON/PNG."
  }
};
