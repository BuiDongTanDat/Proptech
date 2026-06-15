import { AccountStatus, ContactStatus, PropertyStatus, UserRole } from "../../core/enum/enums";

// Contact status
const CONTACT_STATUS_CLASS: Record<ContactStatus, string> = {
    [ContactStatus.NEW]: 'bg-blue-100 text-blue-600',
    [ContactStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-600',
    [ContactStatus.RESOLVED]: 'bg-green-100 text-green-600',
    [ContactStatus.SPAM]: 'bg-red-100 text-red-600',
};

export function getContactStatusClass(status: ContactStatus): string {
    return CONTACT_STATUS_CLASS[status] ?? 'bg-gray-100 text-gray-500';
}

// Property/Post status
const POST_STATUS_CLASS: Record<PropertyStatus, string> = {
    [PropertyStatus.DRAFT]: 'bg-gray-100 text-gray-600',
    [PropertyStatus.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-600',
    [PropertyStatus.PRIVATE]: 'bg-purple-100 text-purple-600',
    [PropertyStatus.PUBLISHED]: 'bg-green-100 text-green-600',
    [PropertyStatus.REJECTED]: 'bg-red-100 text-red-600',
};

export function getPostStatusClass(status: PropertyStatus): string {
    return POST_STATUS_CLASS[status] ?? 'bg-gray-100 text-gray-500';
}

// User role
const ROLE_CLASS: Record<UserRole, string> = {
    [UserRole.MANAGER]: 'bg-orange-100 text-orange-600',
    [UserRole.STAFF]: 'bg-blue-100 text-blue-600',
    [UserRole.INTERN]: 'bg-cyan-100 text-cyan-600',
};

export function getRoleClass(role: UserRole): string {
    return ROLE_CLASS[role] ?? 'bg-gray-100 text-gray-500';
}

// Account status text color
const ACCOUNT_STATUS_CLASS: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: 'text-green-600',
    [AccountStatus.PENDING]: 'text-yellow-600',
    [AccountStatus.INACTIVE]: 'text-red-600',
};

export function getAccountStatusClass(status: AccountStatus): string {
    return ACCOUNT_STATUS_CLASS[status] ?? 'text-gray-500';
}

// Account status background
const ACCOUNT_STATUS_BG_CLASS: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: 'bg-green-600',
    [AccountStatus.PENDING]: 'bg-yellow-600',
    [AccountStatus.INACTIVE]: 'bg-red-600',
};

export function getAccountStatusBgClass(status: AccountStatus): string {
    return ACCOUNT_STATUS_BG_CLASS[status] ?? 'bg-gray-100';
}


export const contactFormTemplate = `
<div
  style="
    width:100%;
    padding:24px 16px;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
    background:transparent;
  "
>
  <div
    style="
      max-width:1200px;
      margin:0 auto;
    "
  >
    <div
      style="
        text-align:center;
        margin-bottom:20px;
      "
    >
      <div
        style="
          color:#162b52;
          font-size:28px;
          font-weight:700;
          font-style:italic;
          line-height:1.4;
        "
      >
        *Đăng ký nhận trọn bộ thông tin dự án, hỗ trợ tham quan thực tế và tư vấn trực tiếp
      </div>

      <div
        style="
          margin-top:6px;
          color:#162b52;
          font-size:14px;
          font-style:italic;
          opacity:0.8;
        "
      >
        Cập nhật bảng giá, chính sách bán hàng và ưu đãi mới nhất
      </div>
    </div>

    <div
      style="
        display:flex;
        gap:18px;
        flex-wrap:wrap;
        align-items:center;
      "
    >
      <!-- HỌ TÊN -->
      <input
        type="text"
        placeholder="Họ tên (*)"
        style="
          flex:1;
          min-width:220px;
          height:40px;
          border:none;
          padding:0 14px;
          box-sizing:border-box;
          background:#ffffff;
          color:#111827;
          font-size:14px;
          outline:none;
        "
      />

      <!-- SỐ ĐIỆN THOẠI -->
      <input
        type="tel"
        placeholder="Số điện thoại (*)"
        style="
          flex:1;
          min-width:220px;
          height:40px;
          border:none;
          padding:0 14px;
          box-sizing:border-box;
          background:#ffffff;
          color:#111827;
          font-size:14px;
          outline:none;
        "
      />

      <!-- EMAIL -->
      <input
        type="email"
        placeholder="Email"
        style="
          flex:1;
          min-width:220px;
          height:40px;
          border:none;
          padding:0 14px;
          box-sizing:border-box;
          background:#ffffff;
          color:#111827;
          font-size:14px;
          outline:none;
        "
      />

      <!-- BUTTON -->
      <button
        type="button"
        data-action="emit-contact-form"
        style="
          min-width:240px;
          height:40px;
          border:none;
          padding:0 24px;
          background:#162b52;
          color:#ffffff;
          font-size:14px;
          font-weight:700;
          cursor:pointer;
          white-space:nowrap;
        "
      >
        ĐĂNG KÝ TƯ VẤN
      </button>
    </div>
  </div>
</div>
`.trim();
export const contactFormTemplateDesign = {
    counters: {
        u_row: 1,
        u_column: 1,
        u_content_html: 1,
    },
    body: {
        id: 'contact-form-body',
        rows: [
            {
                id: 'contact-form-row',
                cells: [1],
                columns: [
                    {
                        id: 'contact-form-column',
                        contents: [
                            {
                                id: 'contact-form-html',
                                type: 'html',
                                values: {
                                    html: contactFormTemplate,
                                    containerPadding: '0px',
                                    displayCondition: null,
                                    _styleGuide: null,
                                    _meta: {
                                        htmlID: 'u_content_html_contact_form',
                                        htmlClassNames: 'u_content_html',
                                    },
                                    selectable: true,
                                    draggable: true,
                                    duplicatable: true,
                                    deletable: true,
                                    hideable: true,
                                    locked: false,
                                },
                            },
                        ],
                        values: {
                            backgroundColor: '',
                            padding: '0px',
                            border: {},
                            borderRadius: '0px',
                            _meta: {
                                htmlID: 'u_column_contact_form',
                                htmlClassNames: 'u_column',
                            },
                            deletable: true,
                            locked: false,
                        },
                    },
                ],
                values: {
                    displayCondition: null,
                    columns: false,
                    _styleGuide: null,
                    backgroundColor: '',
                    columnsBackgroundColor: '',
                    backgroundImage: {
                        url: '',
                        fullWidth: true,
                        repeat: 'no-repeat',
                        size: 'custom',
                        position: 'center',
                        customPosition: ['50%', '50%'],
                    },
                    padding: '0px',
                    anchor: '',
                    hideDesktop: false,
                    _meta: {
                        htmlID: 'u_row_contact_form',
                        htmlClassNames: 'u_row',
                    },
                    selectable: true,
                    draggable: true,
                    duplicatable: true,
                    deletable: true,
                    hideable: true,
                    locked: false,
                },
            },
        ],
        values: {
            backgroundColor: '#f8fafc',
            contentWidth: '600px',
            fontFamily: {
                label: 'Arial',
                value: 'arial,helvetica,sans-serif',
            },
            linkStyle: {
                body: true,
                linkColor: '#2563eb',
                linkHoverColor: '#1d4ed8',
                linkUnderline: true,
                linkHoverUnderline: true,
            },
            _meta: {
                htmlID: 'u_body_contact_form',
                htmlClassNames: 'u_body',
            },
        },
    },
};