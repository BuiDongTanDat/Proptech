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


export const contactFormTemplate =
    `
      <div
  style="
    width: 100%;
    background: linear-gradient(135deg, #162b52 0%, #1f3c73 100%);
    padding: 48px 24px;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
  "
>
  <div
    style="
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 48px;
      flex-wrap: wrap;
    "
  >
    <!-- LEFT CONTENT -->
    <div style="flex: 1; min-width: 280px">
      <div
        style="
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        NHẬN THÔNG TIN DỰ ÁN
      </div>

      <h2
        style="
          margin: 16px 0 10px;
          color: #ffffff;
          font-size: 30px;
          line-height: 1.25;
          font-weight: 700;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        Đăng ký nhận tư vấn bất động sản
      </h2>

      <p
        style="
          margin: 0;
          max-width: 520px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          line-height: 1.8;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        Cập nhật bảng giá, chính sách ưu đãi và những dự án mới nhất.
        Đội ngũ chuyên viên của chúng tôi sẽ liên hệ hỗ trợ trong thời gian sớm nhất.
      </p>
    </div>

    <!-- FORM CARD -->
    <div
      style="
        width: 420px;
        max-width: 100%;
        background: #ffffff;
        border-radius: 20px;
        padding: 24px;
        box-sizing: border-box;
        box-shadow:
          0 10px 20px rgba(0, 0, 0, 0.05),
          0 20px 40px rgba(0, 0, 0, 0.08);
      "
    >
      <div style="margin-bottom: 20px">
        <h3
          style="
            margin: 0;
            color: #111827;
            font-size: 18px;
            font-weight: 700;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          Đăng ký ngay
        </h3>

        <p
          style="
            margin: 6px 0 0;
            color: #6b7280;
            font-size: 12px;
            line-height: 1.6;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          Điền thông tin để được tư vấn miễn phí.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px">
        <!-- NAME -->
        <input
          type="text"
          placeholder="Họ và tên"
          style="
            width: 100%;
            height: 44px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 0 14px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #fafafa;
            box-sizing: border-box;
            outline: none;
          "
        />

        <!-- PHONE -->
        <input
          type="tel"
          placeholder="Số điện thoại"
          style="
            width: 100%;
            height: 44px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 0 14px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #fafafa;
            box-sizing: border-box;
            outline: none;
          "
        />

        <!-- MESSAGE -->
        <textarea
          placeholder="Nội dung cần tư vấn..."
          style="
            width: 100%;
            height: 120px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #fafafa;
            resize: none;
            line-height: 1.6;
            box-sizing: border-box;
            outline: none;
          "
        ></textarea>

        <!-- BUTTON -->
        <button
          type="button"
          data-action="emit-contact-form"
          style="
            width: 100%;
            height: 46px;
            border: none;
            border-radius: 10px;
            background: #ff6b00;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            font-family: Arial, Helvetica, sans-serif;
            letter-spacing: 0.5px;
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(255, 107, 0, 0.25);
          "
        >
          ĐĂNG KÝ NHẬN THÔNG TIN
        </button>
      </div>

      <p
        style="
          margin: 14px 0 0;
          text-align: center;
          color: #9ca3af;
          font-size: 11px;
          line-height: 1.5;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        Chúng tôi cam kết bảo mật thông tin khách hàng.
      </p>
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