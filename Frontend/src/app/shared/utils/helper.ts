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
    width: 100%;
    padding: 20px 10px;
    box-sizing: border-box;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: transparent;
  "
>
  <div style="max-width: 1000px; margin: 0 auto;">
    <!-- Tiêu đề -->
    <div style="text-align: center; margin-bottom: 18px;">
      <h2
        style="
          color: #162b52;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 6px 0;
          text-transform: uppercase;
          line-height: 1.2;
        "
      >
        Đăng ký nhận tư vấn chuyên sâu
      </h2>

      <p
        style="
          color: #4b5563;
          font-size: 13px;
          margin: 0;
          font-style: italic;
        "
      >
        Nhận ngay bảng giá mới nhất & bộ tài liệu pháp lý dự án
      </p>
    </div>

    <!-- Form Container được bổ sung thuộc tính data-form-container -->
    <div
      data-form-container="contact"
      style="
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      "
    >
      <!-- Input -->
      <div
        style="
          flex: 1;
          min-width: 260px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        "
      >
        <input
          type="text"
          placeholder="Họ tên của bạn (*)"
          style="
            width: 100%;
            height: 40px;
            padding: 0 12px;
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            font-size: 13px;
            box-sizing: border-box;
            background: rgba(255,255,255,0.9);
            outline: none;
          "
        />

        <input
          type="tel"
          placeholder="Số điện thoại (*)"
          style="
            width: 100%;
            height: 40px;
            padding: 0 12px;
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            font-size: 13px;
            box-sizing: border-box;
            background: rgba(255,255,255,0.9);
            outline: none;
          "
        />
      </div>

      <!-- Textarea -->
      <div style="flex: 1.4; min-width: 260px;">
        <textarea
          placeholder="Lời nhắn (Ví dụ: Tôi muốn nhận báo giá căn 2 phòng ngủ...)"
          style="
            width: 100%;
            height: 90px;
            padding: 10px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            font-size: 13px;
            box-sizing: border-box;
            background: rgba(255,255,255,0.9);
            outline: none;
            resize: none;
            font-family: inherit;
          "
        ></textarea>
      </div>

      <!-- Button -->
      <div style="width: 100%; margin-top: 2px;">
        <button
          type="button"
          data-action="emit-contact-form"
          style="
            width: 100%;
            max-width: 240px;
            height: 42px;
            display: block;
            margin: 0 auto;
            background: #162b52;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          "
        >
          Gửi thông tin
        </button>
      </div>
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