import { IContactForm, IProperty, IUserAccount } from "../../types/type";


// ===== PROPERTIES DATA =====
export const propertiesList: IProperty[] = [
  {
    id: 1,
    title: 'The Obsidian Point',
    price: '12,450,000',
    location: 'San Torini, Greece',
    suites: 4,
    baths: 6,
    sqft: 8400,
    architect: 'Studio Mirei',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80',
    badge: 'New Acquisition',
    typologies: ['Modernist'],
    htmlSource: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    
      <style type="text/css">
        
      .u-row {
        display: flex;
        flex-wrap: nowrap;
        margin-left: 0;
        margin-right: 0;
      }

      .u-row .u-col {
        position: relative;
        width: 100%;
        padding-right: 0;
        padding-left: 0;
      }

      
          .u-row .u-col.u-col-100 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        

      
            @media (max-width: 480px) {
              .container {
                max-width: 100% !important;
              }

              .u-row:not(.no-stack) {
                flex-wrap: wrap;
              }

              .u-row:not(.no-stack) .u-col {
                flex: 0 0 100% !important;
                max-width: 100% !important;
              }
            }
          
    
body,html{margin:0;padding:0}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit}html{font-size:14px;-ms-overflow-style:scrollbar;-webkit-tap-highlight-color:rgba(0,0,0,0)}p{margin:0}form .error-field{-webkit-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-name:shake;animation-name:shake}form .error-field input,form .error-field textarea{border-color:#a94442!important;color:#a94442!important}form .field-error{font-size:14px;font-weight:700;padding:5px 10px;position:absolute;right:10px;top:-20px}form .field-error:after{border:solid transparent;border-color:#ebcccc rgba(136,183,213,0) rgba(136,183,213,0);border-width:5px;content:" ";height:0;left:50%;margin-left:-5px;pointer-events:none;position:absolute;top:100%;width:0}form .spinner{margin:0 auto;text-align:center;width:70px}form .spinner>div{-webkit-animation:sk-bouncedelay 1.4s ease-in-out infinite both;animation:sk-bouncedelay 1.4s ease-in-out infinite both;background-color:hsla(0,0%,100%,.5);border-radius:100%;display:inline-block;height:12px;margin:0 2px;width:12px}form .spinner .bounce1{-webkit-animation-delay:-.32s;animation-delay:-.32s}form .spinner .bounce2{-webkit-animation-delay:-.16s;animation-delay:-.16s}@-webkit-keyframes sk-bouncedelay{0%,80%,to{-webkit-transform:scale(0)}40%{-webkit-transform:scale(1)}}@keyframes sk-bouncedelay{0%,80%,to{-webkit-transform:scale(0);transform:scale(0)}40%{-webkit-transform:scale(1);transform:scale(1)}}@-webkit-keyframes shake{0%,to{-webkit-transform:translateZ(0);transform:translateZ(0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}}@keyframes shake{0%,to{-webkit-transform:translateZ(0);transform:translateZ(0)}10%,30%,50%,70%,90%{-webkit-transform:translate3d(-10px,0,0);transform:translate3d(-10px,0,0)}20%,40%,60%,80%{-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}}.container{--bs-gutter-x:0px;--bs-gutter-y:0;margin-left:auto;margin-right:auto;padding-left:calc(var(--bs-gutter-x)*.5);padding-right:calc(var(--bs-gutter-x)*.5);width:100%}sub,sup{line-height:0}

a[onclick]{cursor:pointer}


      

      
body { font-family: arial,helvetica,sans-serif; font-size: 1rem; line-height: 1.5; color: #000000; background-color: #F7F8F9; } #u_body a { color: #0000ee; text-decoration: underline; } #u_body a:hover { color: #0000ee; text-decoration: underline; } #u_content_button_1 a:hover { color: #FFFFFF !important; background-color: #0879A1 !important; }
      </style>
    
    
  </head>
  <body>
    
  <div id="u_body" class="u_body" style="min-height: 100vh; display: flex; flex-direction: column;">
    
  <div id="u_row_1" class="u_row" style="padding: 0px;">
    <div class="container" style="max-width: 880px;margin: 0 auto;">
      <div class="u-row">
        
<div id="u_column_1" class="u-col u-col-100 u_column" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;">
  <div style="width: 100%;padding:0px;">
    
  <div id="u_content_image_1" class="u_content_image" style="overflow-wrap: break-word;padding: 10px;">
    
<div style="position:relative;line-height:0px;text-align:center">
  
  <img alt="" src="https://assets.unlayer.com/projects/123456/1778743408927-maldives.jpg" style="width: 100%;max-width: 860px;" title=""/>
  
</div>

  </div>

  <div id="u_content_button_1" class="u_content_button" style="overflow-wrap: break-word;padding: 10px;">
    
<div style="text-align: center;">
  <a href="" target="_blank" style="color:#FFFFFF;background-color:#0879A1;border-radius: 4px;line-height:120%;display:inline-block;text-decoration:none;text-align:center;padding:10px 20px;width:auto;max-width:100%;word-wrap:break-word;font-size: 14px;">
    <span><span>Button Text</span></span>
  </a>
</div>

  </div>

  </div>
</div>

      </div>
    </div>
  </div>

  <div id="u_row_2" class="u_row" style="padding: 0px;">
    <div class="container" style="max-width: 880px;margin: 0 auto;">
      <div class="u-row">
        
<div id="u_column_2" class="u-col u-col-100 u_column" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;">
  <div style="width: 100%;padding:0px;">
    
  <div id="u_content_paragraph_1" class="u_content_paragraph" style="overflow-wrap: break-word;padding: 10px;">
    
  <div style="font-size: 14px; line-height: 1.4;  text-align: left; word-wrap: break-word;">
    <p><span>This is a new Paragraph block. Change the text.  This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.</span></p>
  </div>

  </div>

  <div id="u_content_image_2" class="u_content_image" style="overflow-wrap: break-word;padding: 10px;">
    
<div style="position:relative;line-height:0px;text-align:center">
  
  <img alt="" src="https://assets.unlayer.com/projects/123456/1778743501115-sweden.jpg" style="width: 100%;max-width: 860px;" title=""/>
  
</div>

  </div>

  </div>
</div>

      </div>
    </div>
  </div>

  </div>

  </body>
</html>
`,
    jsonSource: {
      "counters": {
        "u_column": 2,
        "u_row": 2,
        "u_content_image": 2,
        "u_content_button": 1,
        "u_content_paragraph": 1
      },
      "body": {
        "id": "J5oROWiIt0",
        "rows": [
          {
            "id": "hNlIjFzv0H",
            "cells": [
              1
            ],
            "columns": [
              {
                "id": "M6MBRe_d2m",
                "contents": [
                  {
                    "id": "rDF9yyg4Mv",
                    "type": "image",
                    "values": {
                      "containerPadding": "10px",
                      "anchor": "",
                      "src": {
                        "url": "https://assets.unlayer.com/projects/123456/1778743408927-maldives.jpg",
                        "width": 1000,
                        "height": 670,
                        "id": 39778774,
                        "filename": "maldives.jpg",
                        "contentType": "image/jpeg",
                        "size": 721157,
                        "dynamic": true
                      },
                      "textAlign": "center",
                      "altText": "",
                      "action": {
                        "name": "web",
                        "values": {
                          "href": "",
                          "target": "_blank"
                        }
                      },
                      "displayCondition": null,
                      "_styleGuide": null,
                      "_meta": {
                        "htmlID": "u_content_image_1",
                        "htmlClassNames": "u_content_image"
                      },
                      "selectable": true,
                      "draggable": true,
                      "duplicatable": true,
                      "deletable": true,
                      "hideable": true,
                      "locked": false,
                      "pending": false
                    }
                  },
                  {
                    "id": "Yd06fvIsl3",
                    "type": "button",
                    "values": {
                      "textJson": "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Button Text\",\"type\":\"extended-text\",\"version\":1}],\"format\":\"\",\"indent\":0,\"type\":\"extended-paragraph\",\"version\":1,\"textFormat\":0,\"isInlineTool\":true}],\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
                      "href": {
                        "name": "web",
                        "values": {
                          "href": "",
                          "target": "_blank"
                        }
                      },
                      "buttonColors": {
                        "color": "#FFFFFF",
                        "backgroundColor": "#0879A1",
                        "hoverColor": "#FFFFFF",
                        "hoverBackgroundColor": "#0879A1"
                      },
                      "size": {
                        "autoWidth": true,
                        "width": "100%"
                      },
                      "fontSize": "14px",
                      "lineHeight": "120%",
                      "textAlign": "center",
                      "padding": "10px 20px",
                      "border": {},
                      "borderRadius": "4px",
                      "displayCondition": null,
                      "_styleGuide": null,
                      "containerPadding": "10px",
                      "anchor": "",
                      "_meta": {
                        "htmlID": "u_content_button_1",
                        "htmlClassNames": "u_content_button"
                      },
                      "selectable": true,
                      "draggable": true,
                      "duplicatable": true,
                      "deletable": true,
                      "hideable": true,
                      "locked": false,
                      "_languages": {},
                      "text": "<span><span>Button Text</span></span>"
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "",
                  "padding": "0px",
                  "border": {},
                  "borderRadius": "0px",
                  "_meta": {
                    "htmlID": "u_column_1",
                    "htmlClassNames": "u_column"
                  },
                  "deletable": true,
                  "locked": false
                }
              }
            ],
            "values": {
              "displayCondition": null,
              "columns": false,
              "_styleGuide": null,
              "backgroundColor": "",
              "columnsBackgroundColor": "",
              "backgroundImage": {
                "url": "",
                "fullWidth": true,
                "repeat": "no-repeat",
                "size": "custom",
                "position": "center",
                "customPosition": [
                  "50%",
                  "50%"
                ]
              },
              "padding": "0px",
              "anchor": "",
              "hideDesktop": false,
              "_meta": {
                "htmlID": "u_row_1",
                "htmlClassNames": "u_row"
              },
              "selectable": true,
              "draggable": true,
              "duplicatable": true,
              "deletable": true,
              "hideable": true,
              "locked": false
            }
          },
          {
            "id": "NxE5gnD-C4",
            "cells": [
              1
            ],
            "columns": [
              {
                "id": "wiIhHrdG7y",
                "contents": [
                  {
                    "id": "gKFZrsVYNN",
                    "type": "paragraph",
                    "values": {
                      "textJson": "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"This is a new Paragraph block. Change the text.  This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.\",\"type\":\"extended-text\",\"version\":1}],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"extended-paragraph\",\"version\":1,\"textFormat\":0,\"textStyle\":\"\",\"isInlineTool\":false}],\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
                      "containerPadding": "10px",
                      "anchor": "",
                      "fontSize": "14px",
                      "textAlign": "left",
                      "lineHeight": "140%",
                      "linkStyle": {
                        "inherit": true,
                        "linkColor": "#0000ee",
                        "linkHoverColor": "#0000ee",
                        "linkUnderline": true,
                        "linkHoverUnderline": true
                      },
                      "displayCondition": null,
                      "_styleGuide": null,
                      "_meta": {
                        "htmlID": "u_content_paragraph_1",
                        "htmlClassNames": "u_content_paragraph"
                      },
                      "selectable": true,
                      "draggable": true,
                      "duplicatable": true,
                      "deletable": true,
                      "hideable": true,
                      "locked": false,
                      "_languages": {},
                      "text": "<p><span>This is a new Paragraph block. Change the text.  This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.This is a new Paragraph block. Change the text.</span></p>"
                    }
                  },
                  {
                    "id": "7bUxjSqeDT",
                    "type": "image",
                    "values": {
                      "containerPadding": "10px",
                      "anchor": "",
                      "src": {
                        "url": "https://assets.unlayer.com/projects/123456/1778743501115-sweden.jpg",
                        "width": 1000,
                        "height": 936,
                        "id": 39778788,
                        "filename": "sweden.jpg",
                        "contentType": "image/jpeg",
                        "size": 1310605,
                        "dynamic": true
                      },
                      "textAlign": "center",
                      "altText": "",
                      "action": {
                        "name": "web",
                        "values": {
                          "href": "",
                          "target": "_blank"
                        }
                      },
                      "displayCondition": null,
                      "_styleGuide": null,
                      "_meta": {
                        "htmlID": "u_content_image_2",
                        "htmlClassNames": "u_content_image"
                      },
                      "selectable": true,
                      "draggable": true,
                      "duplicatable": true,
                      "deletable": true,
                      "hideable": true,
                      "locked": false,
                      "pending": false
                    }
                  }
                ],
                "values": {
                  "backgroundColor": "",
                  "padding": "0px",
                  "border": {},
                  "borderRadius": "0px",
                  "_meta": {
                    "htmlID": "u_column_2",
                    "htmlClassNames": "u_column"
                  },
                  "deletable": true,
                  "locked": false
                }
              }
            ],
            "values": {
              "displayCondition": null,
              "columns": false,
              "_styleGuide": null,
              "backgroundColor": "",
              "columnsBackgroundColor": "",
              "backgroundImage": {
                "url": "",
                "fullWidth": true,
                "repeat": "no-repeat",
                "size": "custom",
                "position": "center"
              },
              "padding": "0px",
              "anchor": "",
              "_meta": {
                "htmlID": "u_row_2",
                "htmlClassNames": "u_row"
              },
              "selectable": true,
              "draggable": true,
              "duplicatable": true,
              "deletable": true,
              "hideable": true,
              "locked": false
            }
          }
        ],
        "headers": [],
        "footers": [],
        "values": {
          "_styleGuide": null,
          "popupPosition": "center",
          "popupDisplayDelay": 0,
          "popupWidth": "600px",
          "popupHeight": "auto",
          "borderRadius": "10px",
          "contentAlign": "center",
          "contentVerticalAlign": "middle",
          "contentWidth": "880px",
          "fontFamily": {
            "label": "Arial",
            "value": "arial,helvetica,sans-serif"
          },
          "textColor": "#000000",
          "popupBackgroundColor": "#FFFFFF",
          "popupBackgroundImage": {
            "url": "",
            "fullWidth": true,
            "repeat": "no-repeat",
            "size": "cover",
            "position": "center",
            "customPosition": [
              "50%",
              "50%"
            ]
          },
          "popupOverlay_backgroundColor": "rgba(0, 0, 0, 0.1)",
          "popupCloseButton_position": "top-right",
          "popupCloseButton_backgroundColor": "#DDDDDD",
          "popupCloseButton_iconColor": "#000000",
          "popupCloseButton_borderRadius": "0px",
          "popupCloseButton_margin": "0px",
          "popupCloseButton_action": {
            "name": "close_popup",
            "attrs": {
              "onClick": "document.querySelector('.u-popup-container').style.display = 'none';"
            }
          },
          "language": {},
          "backgroundColor": "#F7F8F9",
          "preheaderText": "",
          "linkStyle": {
            "body": true,
            "linkColor": "#0000ee",
            "linkHoverColor": "#0000ee",
            "linkUnderline": true,
            "linkHoverUnderline": true
          },
          "backgroundImage": {
            "url": "",
            "fullWidth": true,
            "repeat": "no-repeat",
            "size": "custom",
            "position": "center",
            "customPosition": [
              "50%",
              "50%"
            ]
          },
          "accessibilityTitle": "",
          "_meta": {
            "htmlID": "u_body",
            "htmlClassNames": "u_body"
          }
        }
      },
      "schemaVersion": 24
    }
  },
  {
    id: 2,
    title: 'Luminal Sanctuary',
    price: '8,900,000',
    location: 'Aspen, Colorado',
    suites: 4,
    baths: 5,
    sqft: 5200,
    architect: 'Hecker',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
    typologies: ['Minimalist'],
  },
  {
    id: 3,
    title: 'The Gilded Horizon',
    price: '18,200,000',
    location: 'Palm Springs, CA',
    suites: 7,
    baths: 9,
    sqft: 12000,
    architect: 'Desert Form',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    badge: 'Featured',
    typologies: ['Modernist', 'Minimalist'],
  },
  {
    id: 4,
    title: 'Ether Heights',
    price: '6,150,000',
    location: 'Tokyo, Japan',
    suites: 3,
    baths: 3,
    sqft: 3500,
    architect: 'Kenzo & Assoc.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
    typologies: ['Industrial', 'Minimalist'],
  },
  {
    id: 5,
    title: 'The Obsidian Point 2',
    price: '12,450,000',
    location: 'San Torini, Greece',
    suites: 4,
    baths: 6,
    sqft: 8400,
    architect: 'Studio Mirei',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80',
    badge: 'New Acquisition',
    typologies: ['Modernist'],
  },
  {
    id: 6,
    title: 'Luminal Sanctuary',
    price: '8,900,000',
    location: 'Aspen, Colorado',
    suites: 4,
    baths: 5,
    sqft: 5200,
    architect: 'Hecker',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
    typologies: ['Minimalist'],
  },
  {
    id: 7,
    title: 'The Gilded Horizon',
    price: '18,200,000',
    location: 'Palm Springs, CA',
    suites: 7,
    baths: 9,
    sqft: 12000,
    architect: 'Desert Form',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    badge: 'Featured',
    typologies: ['Modernist', 'Minimalist'],
  },
  {
    id: 8,
    title: 'Ether Heights',
    price: '6,150,000',
    location: 'Tokyo, Japan',
    suites: 3,
    baths: 3,
    sqft: 3500,
    architect: 'Kenzo & Assoc.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
    typologies: ['Industrial', 'Minimalist'],
  },
];

// ===== ACCOUNT USER DATA =====
export const usersList: IUserAccount[] = [
  {
    id: 1,
    fullName: 'Nguyễn Minh Quân',
    email: 'quan.admin@realestate.vn',
    phone: '0901234567',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/300?img=1',
    status: 'active',
    createdAt: '2026-01-10',
  },
  {
    id: 2,
    fullName: 'Trần Hoàng Nam',
    email: 'nam.staff@realestate.vn',
    phone: '0912345678',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=2',
    status: 'active',
    createdAt: '2026-02-18',
  },
  {
    id: 3,
    fullName: 'Lê Thu Hà',
    email: 'ha.staff@realestate.vn',
    phone: '0987654321',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=3',
    status: 'inactive',
    createdAt: '2026-03-02',
  },
  {
    id: 4,
    fullName: 'Phạm Quốc Bảo',
    email: 'bao.admin@realestate.vn',
    phone: '0934567890',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/300?img=4',
    status: 'active',
    createdAt: '2026-03-15',
  },
  {
    id: 5,
    fullName: 'Đặng Ngọc Linh',
    email: 'linh.staff@realestate.vn',
    phone: '0978123456',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=5',
    status: 'active',
    createdAt: '2026-04-01',
  },
  {
    id: 6,
    fullName: 'Võ Thành Đạt',
    email: 'dat.staff@realestate.vn',
    phone: '0945678123',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=6',
    status: 'inactive',
    createdAt: '2026-04-08',
  },
  {
    id: 7,
    fullName: 'Ngô Gia Huy',
    email: 'huy.admin@realestate.vn',
    phone: '0961237894',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/300?img=7',
    status: 'active',
    createdAt: '2026-04-15',
  },
  {
    id: 8,
    fullName: 'Bùi Khánh Vy',
    email: 'vy.staff@realestate.vn',
    phone: '0923456789',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=8',
    status: 'active',
    createdAt: '2026-04-20',
  },
];


// ===== CONTACT DATA =====
export const contactFormsList: IContactForm[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    phone: '0901234567',
    message: 'Tôi muốn tìm hiểu thêm về dự án căn hộ tại Quận 2.',
    createdAt: '2026-05-01 09:15',
    status: 'new',
  },
  {
    id: 2,
    fullName: 'Trần Thị Mai',
    email: 'mai.tran@gmail.com',
    phone: '0912345678',
    message: 'Cho tôi xin bảng giá và chính sách thanh toán mới nhất.',
    createdAt: '2026-05-01 14:20',
    status: 'contacted',
  },
  {
    id: 3,
    fullName: 'Lê Quốc Huy',
    email: 'huy.le@gmail.com',
    phone: '0987654321',
    message: 'Tôi muốn đặt lịch tham quan nhà mẫu vào cuối tuần.',
    createdAt: '2026-05-02 10:45',
    status: 'new',
  },
  {
    id: 4,
    fullName: 'Phạm Minh Đức',
    email: 'duc.pham@gmail.com',
    phone: '0934567890',
    message: 'Dự án có hỗ trợ vay ngân hàng không?',
    createdAt: '2026-05-02 16:05',
    status: 'closed',
  },
  {
    id: 5,
    fullName: 'Đặng Thu Hà',
    email: 'ha.dang@gmail.com',
    phone: '0978123456',
    message: 'Tôi cần tư vấn căn hộ 2 phòng ngủ giá dưới 3 tỷ.',
    createdAt: '2026-05-03 08:30',
    status: 'contacted',
  },
  {
    id: 6,
    fullName: 'Võ Thành Nam',
    email: 'nam.vo@gmail.com',
    phone: '0945678123',
    message: 'Xin gửi thêm thông tin về tiến độ xây dựng dự án.',
    createdAt: '2026-05-03 13:10',
    status: 'new',
  },
  {
    id: 7,
    fullName: 'Bùi Ngọc Linh',
    email: 'linh.bui@gmail.com',
    phone: '0923456789',
    message: 'Tôi muốn đăng ký nhận thông tin mở bán sớm.',
    createdAt: '2026-05-04 11:25',
    status: 'new',
  },
  {
    id: 8,
    fullName: 'Ngô Gia Bảo',
    email: 'bao.ngo@gmail.com',
    phone: '0961237894',
    message: 'Cho tôi hỏi phí quản lý hàng tháng là bao nhiêu?',
    createdAt: '2026-05-04 17:40',
    status: 'closed',
  },
];